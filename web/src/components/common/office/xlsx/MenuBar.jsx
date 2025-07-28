import styles from './MenuBar.module.scss';
import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Button } from '../../../../shadcn/components/ui/button';
import { goto } from '../../utils/route_util';

export function MenuBar({ editor, onNaviSwitch }) {
    const [title, set_title] = useState('');

    useAsyncEffect(
        async (is_mounted) => {
            if (!is_mounted() || !editor) {
                return;
            }
            const text = await editor.fetch_title();
            set_title(text);
        },
        () => {
            if (!editor) {
                return;
            }
            set_title('');
        },
        [editor]
    );

    return (
        <div className={styles.root}>
            <div className={styles.left}>
                <Button
                    variant="link"
                    onClick={() => {
                        // #v-ifdef VITE_STARRYHOOT_WEB
                        goto('/drive');
                        // #v-elif VITE_STARRYHOOT_ELECTRON
                        starryhoot.goto_home_tab();
                        // #v-endif
                    }}
                >
                    My Files
                </Button>
            </div>
            <div className={styles.center}>{title}</div>
            <div className={styles.right}>
                <Button>Print</Button>
            </div>
        </div>
    );
}
