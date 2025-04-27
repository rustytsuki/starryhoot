import { ipcRenderer, contextBridge } from 'electron/renderer';
import path from 'path';

function get_target(platform, arch) {
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

function load_roffice() {
    const { platform, arch } = process;
    console.log(`load kernel for platform: ${platform}, arch: ${arch}`);
    if (process.env.NODE_ENV === 'development' || process.env.DEV_WITH_PROD_PAGES) {
        const target = get_target(platform, arch);
        return require(path.join(__dirname, `../../../deploy/roffice/${target}/bin/roffice.node`));
    } else {
        if ('darwin' == platform) {
            return require(path.join(path.dirname(process.execPath), '../../../../MacOS/roffice.node'));
        } else {
            return require(path.join(path.dirname(process.execPath), 'roffice.node'));
        }
    }
}

contextBridge.exposeInMainWorld('starryhoot', {
    open_file_dialog() {
        ipcRenderer.send('open_file_dialog');
    },
    roffice: load_roffice(),
});
