import * as styles from '../../styles.js';
import { useState, useEffect } from 'react';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Switch } from '../../../../shadcn/components/ui/switch.tsx';
import { EditorQuitButton } from '../EditorQuitButton.jsx';

export function MenuBar({ editor, navi_checked, onNaviSwitch, onGoBackClick }) {
    const [title_, set_title] = useState('');
    const [navi_checked_, set_navi_checked] = useState(false);

    let onNaviSwitchClick = (checked) => {
        set_navi_checked(checked);
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

    useEffect(() => {
        set_navi_checked(navi_checked);
    }, [navi_checked]);

    return (
        <div
            className="flex items-center w-full bg-[#f5f5f5] px-4 relative border-b border-[#ddd] box-border"
            style={{ height: styles.top_bar_height }}
        >
            <div className="flex flex-1 justify-start items-center gap-2">
                <EditorQuitButton onGoBackClick={onGoBackClick} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold">{title_}</div>
            <div className="flex flex-1 justify-end items-center gap-2">
                <Switch checked={navi_checked_} onCheckedChange={onNaviSwitchClick}>
                    Navi
                </Switch>
                <Button variant="outline" size="sm">
                    Print
                </Button>
            </div>
        </div>
    );
}
