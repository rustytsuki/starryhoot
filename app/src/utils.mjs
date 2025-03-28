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
        const renderer_src = path.join(__dirname, `../../../web/dist/client`);
        const renderer_dst = path.join(__dirname, `../out/renderer`);
        fs.copySync(renderer_src, renderer_dst, { recursive: true });

        // copy roffice node-api
        const { platform, arch } = process;
        const roffice_src = path.join(__dirname, `../../../deploy/roffice/napi-${platform}-${arch}`);
        const roffice_dst = path.join(__dirname, `../out/roffice/napi-${platform}-${arch}`);
        fs.copySync(roffice_src, roffice_dst, { recursive: true });
    }
}

main();