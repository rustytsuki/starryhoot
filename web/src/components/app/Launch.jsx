import styles from './Launch.module.scss';
import Button from 'react-bootstrap/Button';
import { goto } from '../common/utils/route_util';
import { str_to_base64 } from '../common/utils/base64';

export function Launch() {
    async function openfile_electron() {
        console.log(`factorial(9): ${starryhoot.roffice.factorial(9)}`);
        starryhoot.open_file_dialog();
    }

    return (
        <div className={styles.root}>
            <Button onClick={openfile_electron}>Open File</Button>
            <Button
                variant="link"
                onClick={() => {
                    goto('/about');
                }}
            >
                About
            </Button>
        </div>
    );
}
