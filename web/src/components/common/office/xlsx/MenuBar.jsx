import styles from './MenuBar.module.scss';
import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { FluentProvider, webLightTheme, Button, Switch, Link } from '@fluentui/react-components';
import { goto } from '../../utils/route_util';

const is_app = import.meta.env.PUBLIC_ENV__STARRYHOOT_HOUSE != 'web';

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
        <FluentProvider theme={webLightTheme}>
            <div className={styles.root}>
                <div className={styles.left}>
                    <Link
                        onClick={() => {
                            goto(is_app ? '/' : '/drive');
                        }}
                    >
                        My Files
                    </Link>
                </div>
                <div className={styles.center}>{title}</div>
                <div className={styles.right}>
                    <Button>Print</Button>
                </div>
            </div>
        </FluentProvider>
    );
}
