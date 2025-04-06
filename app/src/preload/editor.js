import { ipcRenderer, contextBridge } from 'electron/renderer';
import path from 'path';

function load_roffice() {
    const { platform, arch } = process;
    // console.log(`platform: ${platform}, arch: ${arch}`);
    if (process.env.NODE_ENV === 'development') {
        return require(path.join(__dirname, `../../../deploy/roffice/x86_64-pc-windows-msvc/bin/roffice.node`));
    } else {
        return require(path.join(__dirname, `../roffice/napi-${platform}-${arch}/roffice.node`));
    }
}

contextBridge.exposeInMainWorld('starryhoot', {
    open_file_dialog() {
        ipcRenderer.send('open_file_dialog');
    },
    roffice: load_roffice(),
});
