import styles from './Launch.module.scss';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { goto } from '../common/utils/route_util';

export function Launch() {
    async function openfile_electron() {
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
