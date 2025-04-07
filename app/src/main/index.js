import { app, BrowserWindow, protocol, ipcMain } from 'electron/main';
import path from 'path';
import url from 'url';
import fs from 'fs';
import * as menu_mgr from './menu_mgr';
import * as tabviews_mgr from './tabviews_mgr';

const createWindow = () => {
    const main_win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, '../preload/tabs.js'),
            sandbox: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        main_win.loadURL('http://127.0.0.1:65432/tabs');
    } else {
        main_win.loadURL('file:///tabs/index.html');
    }

    tabviews_mgr.set_main_window(main_win);
    tabviews_mgr.create_home_view();
};

app.whenReady().then(() => {
    protocol.interceptFileProtocol(
        'file',
        (request, callback) => {
            const parsedUrl = new URL(request.url);
            const urlPath = parsedUrl.pathname;
            let file = path.normalize(path.join(__dirname, `../renderer/${urlPath}`));
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

    // app.on('activate', function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     if (BrowserWindow.getAllWindows().length === 0) createWindow();
    // });

    ipcMain.on('open_file_dialog', (event) => {
        tabviews_mgr.open_file_dialog();
    });

    ipcMain.on('set_active_tab', (event, index) => {
        tabviews_mgr.set_active_index(index);
    });

    ipcMain.on('close_tab', (event, index) => {
        tabviews_mgr.close_tab(index);
    });

    menu_mgr.create_main_menu();
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
