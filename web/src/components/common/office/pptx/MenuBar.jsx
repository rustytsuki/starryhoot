import styles from './MenuBar.module.scss';
import { useState, useEffect } from 'react';
import { Button } from '../../../../shadcn/components/ui/button';
import { Switch } from '../../../../shadcn/components/ui/switch.tsx';
import { goto } from '../../utils/route_util';

export function MenuBar({ editor, onNaviSwitch }) {
    const [title, set_title] = useState('');

    let onNaviSwitchClick = (checked) => {
        onNaviSwitch(checked);
    };

    useEffect(() => {
        let is_mounted = true;

        if (!editor) {
            return;
        }

        (async () => {
            if (is_mounted) {
                const text = await editor.fetch_title();
                set_title(text);
            }
        })();

        return () => {
            is_mounted = false;
            set_title('');
        };
    }, [editor]);

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
                <Switch onCheckedChange={onNaviSwitchClick}>Navi</Switch>
                <Button>Print</Button>
            </div>
        </div>
    );
}
