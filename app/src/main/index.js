import { app, BrowserWindow, protocol, dialog, ipcMain } from 'electron/main';
import path from 'path';
import url from 'url';
import fs from 'fs';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://127.0.0.1:65432');
    } else {
        win.loadURL(
            url.format({
                pathname: '/index.html',
                protocol: 'file',
                slashes: true,
            })
        );
    }
};

app.whenReady().then(() => {
    protocol.interceptFileProtocol(
        'file',
        (request, callback) => {
            const url = request.url.substr(8); /* all urls start with 'file:///' */
            let file = path.normalize(path.join(__dirname, `../renderer/${url}`));
            if (!fs.existsSync(file)) {
                file += '/index.html';
            } else {
                const stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    file += '/index.html';
                }
            }
            callback({ path: file });
        },
        (err) => {
            if (err) console.error('Failed to register protocol');
        }
    );

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('open_file_dialog', () => {
        dialog.showOpenDialog({ properties: ['openFile'] });
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
