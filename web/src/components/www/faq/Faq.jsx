import styles from './Faq.module.scss';
import { Navigator } from '../Navigator';

export function Faq() {
    return (
        <>
            <Navigator />
            <h1 className={styles.title}>Frequently Asked Questions</h1>
        </>
    );
}
