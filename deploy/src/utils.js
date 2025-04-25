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

const release_note = JSON.parse(fs.readFileSync(path.join(__dirname, '../version/release_note.json'), 'utf8'));

export function get_project_root_abs_path() {
    return project_root_abs_path;
}

export function get_web_abs_path() {
    return path.resolve(project_root_abs_path, 'web');
}

export function get_app_abs_path() {
    return path.resolve(project_root_abs_path, 'app');
}

export function get_app_dist_abs_path() {
    return path.join(get_app_abs_path(), 'dist');
}

export function get_deploy_abs_path() {
    return path.resolve(project_root_abs_path, 'deploy');
}

export function get_version_file_path() {
    return path.join(get_deploy_abs_path(), 'version', 'version.json');
}

export function get_tag_version() {
    const major = process.env.VERSION_MAJOR || '0';
    const minor = process.env.VERSION_MINOR || '0';
    const patch = process.env.VERSION_PATCH || '0';
    return `v${major}.${minor}.${patch}`;
}

export function get_release_note() {
    const tag_ver = get_tag_version();
    return release_note[tag_ver] || '';
}

export async function get_packed_files(target, pkg) {
    const { platform, arch } = get_node_target(target);
    const tag_ver = get_tag_version();
    let publish_channel = get_channel(target, pkg);

    let files = [];
    let artifact_name = `starryhoot-${tag_ver}-${platform}-${arch}`;
    if (target.indexOf('windows') >= 0) {
        const file_name = artifact_name + '.exe';
        files.push(path.resolve(get_app_dist_abs_path(), file_name));
        files.push(path.resolve(get_app_dist_abs_path(), `${file_name}.blockmap`));
    } else if (target.indexOf('darwin') >= 0) {
        const file_name_dmg = artifact_name + '.dmg';
        const file_name_zip = artifact_name + '.zip';
        files.push(path.resolve(get_app_dist_abs_path(), file_name_dmg));
        files.push(path.resolve(get_app_dist_abs_path(), file_name_zip));
        publish_channel += '-mac';
    } else if (target.indexOf('linux') >= 0) {
        let file_name = '';
        if ('rpm' === pkg) {
            file_name = artifact_name + '.rpm';
        } else if ('deb' === pkg) {
            file_name = artifact_name + '.deb';
        }
        if (file_name) {
            files.push(path.resolve(get_app_dist_abs_path(), file_name));

            if ('arm64' == arch) {
                publish_channel += '-linux-arm64';
            } else if ('x64' == arch) {
                publish_channel += '-linux';
            }
        } else {
            return [];
        }
    }
    
    console.log('publish to channel: ', publish_channel);

    const channel = `${publish_channel}.yml`;
    files.push(path.resolve(get_app_dist_abs_path(), channel));

    return files;
}

export async function download_file(url, file_path) {
    console.log(`Downloading: ${url}`);
    const dir = path.dirname(file_path);
    await fs.ensureDir(dir);
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

function get_channel(target, pkg) {
    const { platform, arch } = get_node_target(target);
    let channel = `latest-${platform}-${arch}`;
    if ('linux' === platform) {
        if (pkg) {
            channel += `-${pkg}`;
        }
    }
    return channel;
}

export function build_version_info(target, pkg) {
    const version_json = {
        'ver_major': process.env.VERSION_MAJOR || '0',
        'ver_minor': process.env.VERSION_MINOR || '0',
        'ver_patch': process.env.VERSION_PATCH || '0',
        'architecture': target,
        'build_time': new Date().toISOString(),
        'pkg': pkg,
        'channel': get_channel(target, pkg),
    };

    const file_path = get_version_file_path();
    const version_str = JSON.stringify(version_json);
    fs.writeFileSync(file_path, version_str);
    console.log(`generate: ${file_path}, ${version_str}`);
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

export function get_node_target(target) {
    let node_target = {};

    if (target.indexOf('windows') >= 0) {
        node_target['platform'] = 'win32';
    } else if (target.indexOf('darwin') >= 0) {
        node_target['platform'] = 'darwin';
    } else if (target.indexOf('linux') >= 0) {
        node_target['platform'] = 'linux';
    }

    if (target.indexOf('x86_64') >= 0) {
        node_target['arch'] = 'x64';
    } else if (target.indexOf('aarch64') >= 0) {
        node_target['arch'] = 'arm64';
    } else if (target.indexOf('i686') >= 0) {
        node_target['arch'] = 'ia32';
    }

    return node_target;
}

export async function exec(cmd, cwd, envs) {
    if (!envs) {
        envs = {};
    }
    
    const options = {
        'cwd': cwd,
        'env': {
            ...process.env,
            ...envs,
            PATH: process.env.PATH,
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
