let prod_name = 'starryhoot';
let exe_name = 'starryhoot-gui';

const config = {
    appId: 'com.starryhoot.app',
    productName: prod_name,
    directories: {
        buildResources: 'build',
    },
    files: ['out', 'resources'],
    asarUnpack: ['resources/**'],
    win: {
        executableName: exe_name,
        target: ['nsis'],
    },
    msi: {
        oneClick: false,
    },
    nsis: {
        artifactName: '${productName}-v${version}-setup.${ext}',
        shortcutName: '${productName}',
        uninstallDisplayName: '${productName}',
        createDesktopShortcut: 'always',
        oneClick: false,
        allowToChangeInstallationDirectory: true,
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
        artifactName: '${productName}-v${version}.${ext}',
    },
    linux: {
        target: ['AppImage', 'snap', 'deb'],
        maintainer: 'electronjs.org',
        category: 'Utility',
    },
    appImage: {
        artifactName: '${productName}-v${version}.${ext}',
    },
    npmRebuild: false,
    publish: {
        provider: 'generic',
        url: 'https://example.com/auto-updates',
    },
};

module.exports = config;
