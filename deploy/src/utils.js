import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import childProcess from 'child_process';
import os from 'os';
import follow_redirects from 'follow-redirects';
import * as tar from 'tar';
import AdmZip from 'adm-zip';

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

export async function download_file(url, file_path) {
    console.log(`Downloading: ${url}`);
    return new Promise((resolve) => {
        follow_redirects.https
            .get(url, (res) => {
                const file_stream = fs.createWriteStream(file_path);
                res.pipe(file_stream);

                file_stream.on('finish', () => {
                    file_stream.close();
                    console.error('Download file to:', file_path);
                    resolve(0);
                });
            })
            .on('error', (err) => {
                console.error('Download failed:', err.message);
                fs.unlinkSync(file_path);
                resolve(1);
            });
    });
}

export async function extract_file(file_path, out_path, is_tar_gz) {
    return new Promise((resolve) => {
        if (is_tar_gz) {
            tar.x({
                file: file_path,
                cwd: out_path,
                sync: true,
            })
                .then(() => {
                    console.log(`✅ Extracted TAR.GZ: ${file_path} -> ${out_path}`);
                    resolve(0);
                })
                .catch((err) => {
                    console.error(`❌ Failed to extract TAR.GZ: ${file_path}`, err.message);
                    resolve(1);
                });
        } else {
            try {
                const zip = new AdmZip(file_path);
                zip.extractAllTo(out_path, true);
                console.log(`✅ Extracted ZIP: ${file_path} -> ${out_path}`);
                resolve(0);
            } catch (err) {
                console.error(`❌ Failed to extract ZIP: ${file_path}`, err.message);
                resolve(1);
            }
        }
    });
}

export function get_auto_target() {
    const platform = os.platform();
    const arch = os.arch();

    if ('win32' === platform) {
        if ('x64' === arch) {
            return 'x86_64-pc-windows-msvc';
        } else if ('arm64' === arch) {
            return 'aarch64-pc-windows-msvc';
        } else if ('ia32' === arch) {
            return 'i686-pc-windows-msvc';
        }
    } else if ('darwin' === platform) {
        if ('x64' === arch) {
            return 'x86_64-apple-darwin';
        } else if ('arm64' === arch) {
            return 'aarch64-apple-darwin';
        }
    } else if ('linux' === platform) {
        if ('x64' === arch) {
            return 'x86_64-unknown-linux-gnu';
        } else if ('arm64' === arch) {
            return 'aarch64-unknown-linux-gnu';
        }
    }
}

export async function exec(cmd, cwd) {
    const options = {
        'cwd': cwd,
        'env': {
            ...process.env,
        },
        'shell': true,
    };

    const platform = os.platform();
    if (platform === 'darwin') {
        options['shell'] = '/bin/zsh';
    } else if (platform === 'linux') {
        options['shell'] = '/bin/bash';
    }

    console.log(`exec: ${cmd}`);

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
