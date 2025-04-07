import commandLineArgs from 'command-line-args';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const optionDefinitions = [
    { name: 'postbuild', type: Boolean},
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    if (config['postbuild']) {
        // copy web ssg pages to renderer
        const renderer_src = path.join(__dirname, `../../web/dist/client`);
        const renderer_dst = path.join(__dirname, `../out/renderer`);
        fs.copySync(renderer_src, renderer_dst, { recursive: true });

        // copy roffice node-api
        const { platform, arch } = process;
        const files = ['roffice.node', 'roffice.dll'];
        const roffice_src = path.join(__dirname, `../../deploy/roffice/x86_64-pc-windows-msvc/bin`);
        const roffice_dst = path.join(__dirname, `../out/roffice`);
        for (let i = 0; i < files.length; ++i) {
            fs.copySync(path.join(roffice_src, files[i]), path.join(roffice_dst, files[i]));
        }
    }
}

main();