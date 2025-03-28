import * as utils from './utils.js';

export async function build_electron(target) {
    if (await run_web_script('npm run electron:build') != 0) {
        return;
    }

    return await run_electron_script('npm run pack:win');
}

async function run_web_script(script) {
    const cwd = utils.get_web_abs_path();
    return await utils.exec(script, cwd);
}

async function run_electron_script(script) {
    const cwd = utils.get_app_abs_path();
    return await utils.exec(script, cwd);
}