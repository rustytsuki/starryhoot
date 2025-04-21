const fs = require('fs');
const path = require('path');

const version_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../deploy/version/version.json'), 'utf8'));
const version = `${version_json.ver_major}.${version_json.ver_minor}.${version_json.ver_patch}`;
const channel = version_json.channel;
const pkg = version_json.pkg;

let exe_name = 'StarryHoot Office';

const config = {
    appId: 'com.starryhoot.app',
    productName: 'StarryHoot Office',
    'extraMetadata': {
        // "name": "StarryHoot",
        'version': version,
        'homepage': "https://rustytsuki.github.io/starryhoot"
        // "description": "StarryHoot Office",
        // "author": "@rustytsuki", // do not set!!! or copyright cannot find ${author}!!! use package.json
        // "license": "BSD-3-CLAUSE"
    },

    artifactName: 'starryhoot-v${version}-${platform}-${arch}.${ext}',
    directories: {
        buildResources: 'build',
    },
    files: ['out', 'resources', '!out/roffice/**'],
    asarUnpack: ['resources/**'],
    win: {
        executableName: exe_name,
        target: ['nsis'],
        extraFiles: [
            {
                from: 'out/roffice/',
                to: '',
                'filter': ['**/*'],
            },
        ],
    },
    nsis: {
        guid: '65b83bba-af4b-421c-b36d-a98964523247',
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
        executableName: exe_name,
        target: ['dmg', 'zip'],
        extraFiles: [
            {
                from: 'out/roffice/',
                to: 'MacOS',
                'filter': ['**/*'],
            },
        ],
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
        title: '${productName}',
    },
    linux: {
        executableName: exe_name,
        target: [pkg],
        extraFiles: [
            {
                from: 'out/roffice/',
                to: '',
                'filter': ['**/*'],
            },
        ],
        maintainer: 'electronjs.org',
        category: 'Utility',
    },
    deb: {
        afterInstall: 'build/linux/postinstall.sh',
        afterRemove: 'build/linux/postremove.sh',
    },
    rpm: {
        afterInstall: 'build/linux/postinstall.sh',
        afterRemove: 'build/linux/postremove.sh',
    },
    npmRebuild: false,
    publish: {
        provider: 'github',
        owner: 'rustytsuki',
        repo: 'starryhoot',
        private: false,
        publishAutoUpdate: true,
        releaseType: 'release',
        vPrefixedTagName: true,
        channel: channel,
    },
};

module.exports = config;
