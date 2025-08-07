import * as styles from '../../styles';
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
        if (!editor) {
            return;
        }

        (async () => {
            const text = await editor.fetch_title();
            set_title(text);
        })();

        return () => {
            set_title('');
        };
    }, [editor]);

    return (
        <div
            className="flex items-center w-full bg-[#f5f5f5] shadow-md px-4 relative border-b border-[#ddd] box-border"
            style={{ height: styles.top_bar_height }}
        >
            <div className="flex flex-1 justify-start items-center gap-2">
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold">{title}</div>
            <div className="flex flex-1 justify-end items-center gap-2">
                <Switch onCheckedChange={onNaviSwitchClick}>Navi</Switch>
                <Button>Print</Button>
            </div>
        </div>
    );
}
