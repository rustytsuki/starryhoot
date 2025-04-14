import commandLineArgs from 'command-line-args';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const optionDefinitions = [
    { name: 'postbuild', type: Boolean },
    { name: 'publish', type: Boolean },
    { name: 'target', type: String },
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    if (config['postbuild']) {
        // copy web ssg pages to renderer
        const renderer_src = path.join(__dirname, `../../web/dist/client`);
        const renderer_dst = path.join(__dirname, `../out/renderer`);
        fs.copySync(renderer_src, renderer_dst, { recursive: true });

        // copy roffice node-api
        const target = config['target'] || get_auto_target();
        if (target.indexOf('windows') >= 0) {
            const files = ['roffice.node', 'roffice.dll'];
            const src = path.join(__dirname, `../../deploy/roffice/${target}/bin`);
            const dst = path.join(__dirname, `../out/roffice`);
            for (let i = 0; i < files.length; ++i) {
                fs.copySync(path.join(src, files[i]), path.join(dst, files[i]));
            }
        }

        if (config['publish']) {
            // copy cli and server
            if (target.indexOf('windows') >= 0) {
                const files = ['starryhoot.exe', 'starryhoot-server.exe'];
                const src = path.join(__dirname, `../../target/${target}/release`);
                const dst = path.join(__dirname, `../out/roffice`);
                for (let i = 0; i < files.length; ++i) {
                    fs.copySync(path.join(src, files[i]), path.join(dst, files[i]));
                }
            }

            const token = process.env.GH_TOKEN;
            if (typeof token !== 'string' || token.trim() === '') {
                console.error('❌ GH_TOKEN is not set or is empty.');
            } else {
                console.log(`✅ GH_TOKEN length: ${token.trim().length}`);
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

main();
