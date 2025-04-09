const fs = require('fs');
const path = require('path');

const version_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/version/version.json'), 'utf8'));
const version = `${version_json.ver_major}.${version_json.ver_minor}.${version_json.ver_patch}`;

let exe_name = 'StarryHoot Office';

const config = {
    appId: 'com.starryhoot.app',
    productName: 'StarryHoot Office',
    "extraMetadata": {
        // "name": "StarryHoot",
        "version": version,
        // "description": "StarryHoot Office",
        // "author": "@rustytsuki", // do not set!!! or copyright cannot find ${author}!!! use package.json
        // "license": "BSD-3-CLAUSE"
    },
    directories: {
        buildResources: 'build',
    },
    files: ['out', 'resources', '!out/roffice/roffice.dll'],
    asarUnpack: ['resources/**'],
    win: {
        executableName: exe_name,
        target: ['nsis'],
        extraFiles: [
            {
                from: 'out/roffice/roffice.dll',
                to: 'roffice.dll',
            },
        ],
    },
    nsis: {
        artifactName: 'starryhoot-v${version}-setup.${ext}',
        shortcutName: '${productName}',
        uninstallDisplayName: '${productName}',
        createDesktopShortcut: 'always',
        createStartMenuShortcut: true,
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: false,
        menuCategory: 'StarryHoot Office',
        runAfterFinish: true,
        license: '../LICENSE',
        warningsAsErrors: false,
        include: 'build/nsis/main.nsh',
    },
    mac: {
        entitlementsInherit: 'electron/build/entitlements.mac.plist',
        extendInfo: [
            { NSCameraUsageDescription: "Application requests access to the device's camera." },
            { NSMicrophoneUsageDescription: "Application requests access to the device's microphone." },
            { NSDocumentsFolderUsageDescription: "Application requests access to the user's Documents folder." },
            { NSDownloadsFolderUsageDescription: "Application requests access to the user's Downloads folder." },
        ],
        notarize: false,
    },
    dmg: {
        artifactName: 'starryhoot-v${version}.${ext}',
    },
    linux: {
        target: ['AppImage', 'snap', 'deb'],
        maintainer: 'electronjs.org',
        category: 'Utility',
    },
    appImage: {
        artifactName: 'starryhoot-v${version}.${ext}',
    },
    npmRebuild: false,
    publish: {
        provider: 'generic',
        url: 'https://example.com/auto-updates',
    },
};

module.exports = config;
