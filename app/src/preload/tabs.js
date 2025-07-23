import { ipcRenderer, contextBridge } from 'electron/renderer';

contextBridge.exposeInMainWorld('starryhoot', {
    on_add_tab: (callback) => ipcRenderer.on('add_tab', (_event, index, title) => callback(index, title)),
    on_remove_tab: (callback) => ipcRenderer.on('remove_tab', (_event, index) => callback(index)),
    on_active_tab: (callback) => ipcRenderer.on('active_tab', (_event, index) => callback(index)),
    set_active_tab: (index) => ipcRenderer.send('set_active_tab', index),
    close_tab: (index) => ipcRenderer.send('close_tab', index),
});
