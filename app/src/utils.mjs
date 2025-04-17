import commandLineArgs from 'command-line-args';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const optionDefinitions = [
    { name: 'postbuild', type: Boolean },
    { name: 'pack', type: Boolean },
    { name: 'target', type: String },
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    if (config['postbuild']) {
        // copy version.json
        const version_src = path.join(__dirname, `../../deploy/version/version.json`);
        const version_dst = path.join(__dirname, `../out/main/version.json`);
        fs.copySync(version_src, version_dst);

        // copy web ssg pages to renderer
        const renderer_src = path.join(__dirname, `../../web/dist/client`);
        const renderer_dst = path.join(__dirname, `../out/renderer`);
        fs.copySync(renderer_src, renderer_dst, { recursive: true });

        let dst_files = [];

        // copy roffice node-api
        const target = config['target'] || get_auto_target();
        {
            let files = [];
            if (target.indexOf('windows') >= 0) {
                files = ['bin/roffice.node', 'bin/roffice.dll'];
            } else if (target.indexOf('apple') >= 0) {
                files = ['bin/roffice.node', 'lib/libroffice.dylib'];
            } else if (target.indexOf('linux') >= 0) {
                files = ['bin/roffice.node', 'lib/libroffice.so'];
            }
            const src = path.join(__dirname, `../../deploy/roffice/${target}`);
            const dst = path.join(__dirname, `../out/roffice`);
            for (let i = 0; i < files.length; ++i) {
                const dst_file = path.join(dst, path.basename(files[i]));
                fs.copySync(path.join(src, files[i]), dst_file);
                dst_files.push(dst_file);
            }
        }

        if (config['pack']) {
            // copy cli and server
            let files = [];
            if (target.indexOf('windows') >= 0) {
                files = ['starryhoot.exe', 'starryhoot-server.exe'];
            } else {
                files = ['starryhoot', 'starryhoot-server'];
            }
            const src = path.join(__dirname, `../../target/${target}/release`);
            const dst = path.join(__dirname, `../out/roffice`);
            for (let i = 0; i < files.length; ++i) {
                const dst_file = path.join(dst, files[i]);
                fs.copySync(path.join(src, files[i]), dst_file);
                dst_files.push(dst_file);
            }
        }

        // modify rpath
        for (let i = 0; i < dst_files.length; ++i) {
            const file_path = dst_files[i];
            const file_name = path.basename(file_path);
            const ext = path.extname(file);

            if (target.indexOf('apple') >= 0) {
                if ('.node' == ext) {
                    if (await modify_mac_exe_rpath(file_path, `@loader_path`)) {
                        process.exit(1);
                    }
                } else if ('.dylib' == ext) {
                    if (await modify_dylib_LC_ID_DYLIB(file_path, `@rpath/${file_name}`)) {
                        process.exit(1);
                    }
                } else {
                    if (await modify_mac_exe_rpath(file_path, `@executable_path`)) {
                        process.exit(1);
                    }
                }
            } else if (target.indexOf('linux') >= 0) {
                if ('.so' != ext) {
                    if (await modify_linux_exe_RUNPATH(file_path, `$ORIGIN`)) {
                        process.exit(1);
                    }
                }
            }
        }
    }
}

function get_auto_target() {
    const { platform, arch } = process;

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

async function modify_dylib_LC_ID_DYLIB(file, lc_id_dylib) {
    const cmd = `install_name_tool -id ${lc_id_dylib} ${file}`;

    return await exec_command(cmd, path.join(__dirname, `./`), `modify ${file} LC_ID_DYLIB to ${lc_id_dylib}`);
}

async function modify_mac_exe_rpath(file, rpath) {
    let cmd = path.resolve(__dirname, 'set_mac_rpath.sh');
    cmd += ` ${file} "${rpath}"`;

    return await utils.exec_command(cmd, path.join(__dirname, `./`), `modify ${file} rptah to ${rpath}`);
}

async function modify_linux_exe_RUNPATH(file, runpath) {
    const cmd = `patchelf --set-rpath '${runpath}' ${file}`;
    return await utils.exec_command(cmd, path.join(__dirname, `./`), `modify ${file} RUNPATH to ${runpath}`);
}

export async function exec_command(cmd, cwd, text) {
    const PATH = `${process.env.PATH}`;

    let options = {
        'cwd': cwd,
        'env': {
            ...process.env,
            PATH: PATH,
        },
        'shell': true,
    };
    if (process.platform == 'darwin') {
        options['shell'] = '/bin/zsh';
    } else if (process.platform == 'linux') {
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
            console.log(`${text} exited with code ${code}`);
            resolve(code);
        });
    });
}

main();
