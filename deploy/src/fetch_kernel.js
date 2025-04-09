import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import { download_file, extract_file } from './utils.js';

const VER = '0.1213';
const HASH = '491f2ec';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export async function fetch_kernel(target) {
    if (!target) {
        return 1;
    }

    let is_tar_gz = target.indexOf('wasm32') < 0 && target.indexOf('windows') < 0;
    let ext = is_tar_gz ? 'tar.gz' : 'zip';

    const file_name = `roffice-v${VER}-${HASH}-${target}.${ext}`;

    // download file
    const url = `https://github.com/rustytsuki/roffice/releases/download/v${VER}/${file_name}`;
    const kernel_dir = path.resolve(__dirname, '../roffice');

    const file_path = path.resolve(kernel_dir, file_name);

    if (!fs.existsSync(file_path)) {
        if (await download_file(url, file_path)) {
            return 1;
        }
    }

    // unzip file
    fs.rmSync(path.resolve(kernel_dir, target), { recursive: true, force: true });
    if (await extract_file(file_path, kernel_dir, is_tar_gz)) {
        return 1;
    }

    return 0;
}
