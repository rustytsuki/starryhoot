import path from 'path';
import fs from 'fs';
import { autoUpdater } from 'electron-updater';
import { dialog, shell } from 'electron';
import log from 'electron-log';

let version = {};

export const WWW = 'https://rustytsuki.github.io/starryhoot';

export function load_version() {
    if ('development' == process.env.NODE_ENV) {
        return;
    }

    const version_json_path = path.join(__dirname, 'version.json');
    const raw = fs.readFileSync(version_json_path, 'utf-8');
    version = JSON.parse(raw);
}

export function show_version() {
    dialog.showMessageBox({
        type: 'info',
        title: 'Version Info',
        message: 'Application Version Information',
        detail: JSON.stringify(version, null, 2),
        buttons: ['OK'],
    });
}

export function check_update_with_prompt() {
    if ('development' == process.env.NODE_ENV) {
        return;
    }

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';

    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'rustytsuki',
        repo: 'starryhoot',
        channel: version.channel,
    });

    autoUpdater.once('update-available', (info) => {
        log.info('🆕 Update available:', info.version);
        dialog
            .showMessageBox({
                type: 'info',
                buttons: ['Yes', 'No'],
                defaultId: 0,
                cancelId: 1,
                title: 'Update Available',
                message: `A new version (${info.version}) is available.`,
                detail: 'Do you want to download it now?',
            })
            .then((result) => {
                if (result.response === 0) {
                    log.info('⬇️ User chose to download the update');
                    autoUpdater.downloadUpdate();
                } else {
                    log.info('❌ User declined to download the update');
                }
            });
    });

    autoUpdater.once('update-not-available', () => {
        log.info('✅ No updates found');
    });

    autoUpdater.once('error', (err) => {
        log.error('❌ Update error:', err);
        dialog
            .showMessageBox({
                type: 'info',
                buttons: ['Goto to Update', 'Later'],
                defaultId: 0,
                cancelId: 1,
                title: 'Cannot Update',
                message: 'Do you want to update manually?',
                detail: `${err}`,
            })
            .then((result) => {
                if (result.response === 0) {
                    shell.openExternal(WWW);
                }
            });
    });

    autoUpdater.once('update-downloaded', (info) => {
        log.info('📦 Update downloaded:', info.version);
        dialog
            .showMessageBox({
                type: 'info',
                buttons: ['Install and Restart', 'Later'],
                defaultId: 0,
                cancelId: 1,
                title: 'Update Ready',
                message: `Version ${info.version} has been downloaded.`,
                detail: 'Would you like to install it now?',
            })
            .then((result) => {
                if (result.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
    });

    autoUpdater.checkForUpdates();
}
