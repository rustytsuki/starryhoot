import { ipcRenderer, contextBridge } from 'electron/renderer';

contextBridge.exposeInMainWorld('starryhoot', {
    open_file_dialog() {
        ipcRenderer.send('open_file_dialog');
    }
});
