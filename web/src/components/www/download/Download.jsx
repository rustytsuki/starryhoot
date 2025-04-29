import styles from './Download.module.scss';
import { Navigator } from '../Navigator';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import jsYaml from 'js-yaml';

const base_url = 'https://github.com/rustytsuki/starryhoot/releases/latest/download';

function get_fetch_download_url(platform, arch, pkg) {
    let url = `${base_url}/update-latest-${platform}-${arch}`;
    if ('linux' == platform) {
        if ('x64' == arch) {
            url += `-${pkg}-linux.yml`;
        } else if ('arm64' == arch) {
            url += `-${pkg}-linux-arm64.yml`;
        }
    } else if ('darwin' == platform) {
        url += '-mac.yml';
    } else {
        url += '.yml';
    }

    return url;
}

function open_release() {
    window.open('https://github.com/rustytsuki/starryhoot/releases', '_blank');
}

async function download(platform, arch, pkg) {
    const url = get_fetch_download_url(platform, arch, pkg);
    const response = await fetch(url);
    if (!response.ok) {
        open_release();
        return;
    }

    const yml_str = await response.text();
    const data = jsYaml.load(yml_str);
    const file_name = data.path || (data.files && data.files[0] && data.files[0].url);
    if (!file_name) {
        open_release();
        return;
    }

    const download_url = `${base_url}/${file_name}`;

    window.open(download_url, '_blank');
}

export function Download() {
    useEffect(() => {
        return () => {};
    }, []);

    return (
        <>
            <Navigator />
            <h1 className={styles.title}>Download StarryHoot</h1>
            <p>Windows</p>
            <Button
                onClick={() => {
                    download('win32', 'x64');
                }}
            >
                X64
            </Button>
            <Button
                onClick={() => {
                    download('win32', 'arm64');
                }}
            >
                Arm64
            </Button>
        </>
    );
}
