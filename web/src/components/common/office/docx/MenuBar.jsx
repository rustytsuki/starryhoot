import styles from './MenuBar.module.scss';
import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { FluentProvider, webLightTheme, Button, Switch, Link } from '@fluentui/react-components';
import { goto } from '../../utils/route_util';

export function MenuBar({ editor, onNaviSwitch }) {
    const [title, set_title] = useState('');

    let onNaviSwitchClick = (e) => {
        onNaviSwitch(e.target.checked);
    };

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
        <FluentProvider theme={webLightTheme}>
            <div className={styles.root}>
                <div className={styles.left}>
                    <Link
                        onClick={() => {
                            // #v-ifdef VITE_STARRYHOOT_WEB
                            goto('/drive');
                            // #v-elif VITE_STARRYHOOT_ELECTRON
                            goto('/');
                            // #v-endif
                        }}
                    >
                        My Files
                    </Link>
                </div>
                <div className={styles.center}>{title}</div>
                <div className={styles.right}>
                    <Switch label="Navi" onInput={onNaviSwitchClick} />
                    <Button>Print</Button>
                </div>
            </div>
        </FluentProvider>
    );
}
