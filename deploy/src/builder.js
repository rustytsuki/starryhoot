import * as utils from './utils.js';

export async function build_all(target) {
    if (await build_pages_for_server(target)) {
        return 1;
    }

    if (await build_pages_for_electron(target)) {
        return 2;
    }

    if (await build_rs(target)) {
        return 3;
    }

    if (await build_electron(target)) {
        return 4;
    }
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
    return await utils.exec('npm run pack:win', cwd);
}

export async function build_rs(target) {
    const cwd = utils.get_project_root_abs_path();
    return await utils.exec('cargo build --release -p starryhoot-cli -p starryhoot-server --features=production', cwd);
}