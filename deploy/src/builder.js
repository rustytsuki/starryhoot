import fs from 'fs-extra';
import * as utils from './utils.js';

export async function build_all(target, pkg) {
    if (target.indexOf('windows') >= 0 && process.platform !== "win32") {
        console.error(`build target ${target} need on windows host.`);
        return 1;
    }
    
    if (target.indexOf('apple') >= 0 && !(process.platform === "darwin")) {
        console.error(`build target ${target} need on macos host.`);
        return 1;
    }

    if (target.indexOf('linux') >= 0 && process.platform !== "linux") {
        console.error(`build target ${target} need on linux host.`);
        return 1;
    }

    utils.build_version_info(target, pkg);

    if (await build_pages_for_server(target)) {
        return 2;
    }

    if (await build_rs(target)) {
        return 3;
    }

    if (await build_pages_for_electron(target)) {
        return 4;
    }

    if (await build_electron(target)) {
        return 5;
    }
}

export async function build_www() {
    utils.build_version_info('www', '');

    const cwd = utils.get_web_abs_path();
    return await utils.exec('npm run www:publish', cwd);
}

async function build_pages_for_electron(target) {
    const cwd = utils.get_web_abs_path();
    return await utils.exec('npm run electron:publish', cwd);
}

async function build_pages_for_server(target) {
    const cwd = utils.get_web_abs_path();
    return await utils.exec('npm run web:publish', cwd);
}

async function build_electron(target) {
    const cwd = utils.get_app_abs_path();
    return await utils.exec(`npm run pack:${target}`, cwd);
}

export async function build_rs(target) {
    const cwd = utils.get_project_root_abs_path();
    let envs = {};
    let cmd = `cargo build --release --target=${target} -p starryhoot-cli -p starryhoot-server --features=production`;
    if (target.indexOf('linux') >= 0 && target.indexOf('aarch64') >= 0) {
        envs['CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER'] = 'aarch64-linux-gnu-gcc';
    }
    return await utils.exec(cmd, cwd, envs);
}