import { UAParser } from 'ua-parser-js';
import { ROUTE } from './ROUTE';
import { goto } from '../common/utils/route_util';

// #v-ifdef VITE_STARRYHOOT_PUBLISH
import version from '../../../../deploy/version/version.json';
// #v-else
let version = {
    'ver_major': '0',
    'ver_minor': '0',
    'ver_patch': '3',
};
// #v-endif

export function get_download_button_name() {
    const parser = new UAParser();

    const os = parser.getOS().name;
    const cpu = parser.getCPU().architecture || "amd64";

    console.log('ua-paser', os, cpu);

    if (!os) {
        return 'Download';
    }

    if ('Windows' === os) {
        if ('arm64' === cpu) {
            return `Download for ${os} (Arm64)`;
        } else if ('amd64' === cpu) {
            return `Download for ${os} (X64)`;
        }
    } else if ('macOS' === os) {
        if ('arm64' === cpu) {
            return `Download for ${os} (Apple silicon)`;
        } else if ('amd64' === cpu) {
            return `Download for ${os} (Intel chip)`;
        }
    } else if ('Linux' === os) {
        return `Download for ${os}`;
    }

    return `Download`;
}

export function auto_download() {
    const parser = new UAParser();

    const os = parser.getOS().name;
    const cpu = parser.getCPU().architecture || "amd64";

    if (!os) {
        goto(ROUTE.DOWNLOAD);
        return;
    }

    let url = '';
    if ('Windows' === os) {
        if ('arm64' === cpu) {
            url = get_download_url('win32', 'arm64');
        } else if ('amd64' === cpu) {
            url = get_download_url('win32', 'x64');
        }
    } else if ('macOS' === os) {
        if ('arm64' === cpu) {
            url = get_download_url('darwin', 'arm64', 'dmg');
        } else if ('amd64' === cpu) {
            url = get_download_url('darwin', 'x64', 'dmg');
        }
    }

    if (url) {
        window.open(url, '_blank');
    } else {
        goto(ROUTE.DOWNLOAD);
    }
}

export function get_download_url(platform, arch, pkg) {
    const ver_str = `v${version.ver_major}.${version.ver_minor}.${version.ver_patch}`;
    const base_url = `https://github.com/rustytsuki/starryhoot/releases/download/${ver_str}/starryhoot-${ver_str}-${platform}`;
    if ('win32' == platform) {
        return `${base_url}-${arch}.exe`;
    } else if ('linux' == platform) {
        if ('rpm' === pkg) {
            if ('arm64' == arch) {
                return `${base_url}-aarch64.rpm`;
            } else if ('x64' == arch) {
                return `${base_url}-x86_64.rpm`;
            }
        } else if ('deb' === pkg) {
            if ('arm64' == arch) {
                return `${base_url}-${arch}.deb`;
            } else if ('x64' == arch) {
                return `${base_url}-amd64.deb`;
            }
        } else if ('tar.gz' === pkg) {
            return `${base_url}-${arch}.tar.gz`;
        }
    } else if ('darwin' == platform) {
        if ('dmg' === pkg) {
            return `${base_url}-${arch}.dmg`;
        } else if ('zip' === pkg) {
            return `${base_url}-${arch}.zip`;
        }
    }
}
