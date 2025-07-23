import { app, Menu, shell } from 'electron';
import * as tabviews_mgr from './tabviews_mgr';
import { WWW, show_version, check_update_with_prompt } from './updater';

const isMac = process.platform === 'darwin';

export function create_main_menu() {
    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: 'about' },
                          { type: 'separator' },
                          { role: 'services' },
                          { type: 'separator' },
                          { role: 'hide' },
                          { role: 'hideOthers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { role: 'quit' },
                      ],
                  },
              ]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    click: async () => {
                        tabviews_mgr.open_file_dialog();
                    },
                },
                {
                    label: 'Close',
                    click: async () => {
                        tabviews_mgr.close_current_tab();
                    },
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' },
            ],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                          { role: 'pasteAndMatchStyle' },
                          { role: 'delete' },
                          { role: 'selectAll' },
                          { type: 'separator' },
                          {
                              label: 'Speech',
                              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
                          },
                      ]
                    : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
            ],
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                // { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Develop',
            submenu: [
                {
                    label: 'DevTools for TabsBar',
                    click: async () => {
                        tabviews_mgr.get_main_window().webContents.openDevTools({ mode: 'detach' });
                    },
                },
                {
                    label: 'DevTools for Current BrowserView',
                    click: async () => {
                        const view = tabviews_mgr.get_current_view();
                        if (view) {
                            view.webContents.openDevTools({ mode: 'detach' });
                        }
                    },
                },
            ],
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
                    : [{ role: 'close' }]),
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Check Update',
                    click: async () => {
                        check_update_with_prompt();
                    },
                },
                {
                    label: 'Update Manually',
                    click: async () => {
                        shell.openExternal(WWW);
                    },
                },
                {
                    label: 'About',
                    click: async () => {
                        show_version();
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
