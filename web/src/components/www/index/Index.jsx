import styles from './Index.module.scss';
import Button from 'react-bootstrap/Button';
import { Navigator } from '../Navigator';
import { ROUTE } from '../ROUTE';
import { goto } from '../../common/utils/route_util';

export function Index() {
    return (
        <>
            <Navigator />
            <h1 className={styles.title}>StarryHoot Home Page</h1>
            <Button size="lg"
                className={styles.download}
                onClick={() => {
                    goto(ROUTE.DOWNLOAD);
                }}
            >
                Download
            </Button>
        </>
    );
}
