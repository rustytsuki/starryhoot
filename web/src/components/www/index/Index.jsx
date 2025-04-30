import styles from './Index.module.scss';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Navigator } from '../Navigator';
import { auto_download, get_download_button_name } from '../downloader';
import { ROUTE } from '../ROUTE';

export function Index() {
    const [download_bt_name_, set_download_bt_name] = useState('Download');

    useEffect(() => {
        const name = get_download_button_name();
        set_download_bt_name(name);
        return () => {};
    }, []);

    return (
        <>
            <Navigator />
            <h1 className={styles.title}>StarryHoot Office</h1>
            <Button
                size="lg"
                className={styles.download}
                onClick={() => {
                    auto_download();
                }}
            >
                {download_bt_name_}
            </Button>
            <Button variant="link" size="sm" className={styles.other} href={ROUTE.DOWNLOAD}>
                other platforms
            </Button>
        </>
    );
}
