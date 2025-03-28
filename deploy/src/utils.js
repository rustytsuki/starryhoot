import path from 'path';
import url from 'url';
import childProcess from 'child_process';
import os from 'os';

const platform = os.platform();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const project_root_abs_path = path.resolve(__dirname, '../../');

export function get_project_root_abs_path() {
    return project_root_abs_path;
}

export function get_web_abs_path() {
    return path.resolve(project_root_abs_path, 'web');
}

export function get_app_abs_path() {
    return path.resolve(project_root_abs_path, 'app');
}

export async function exec(cmd, cwd) {
    const options = {
        'cwd': cwd,
        'env': {
            ...process.env,
        },
        'shell': true,
    };
    if (platform === 'darwin') {
        options['shell'] = '/bin/zsh';
    }

    return new Promise((resolve) => {
        let ps = childProcess.spawn(cmd, options);

        ps.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        ps.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        ps.on('close', (code) => {
            console.log(`run command: ${cmd} in ${cwd} exited with code ${code}`);
            resolve(code);
        });
    });
}