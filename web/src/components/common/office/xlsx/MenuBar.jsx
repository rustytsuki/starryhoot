import * as styles from '../../styles';
import { useState, useEffect } from 'react';
import { Button } from '../../../../shadcn/components/ui/button';
import { EditorQuitButton } from '../EditorQuitButton.jsx';

export function MenuBar({ editor, onGoBackClick }) {
    const [title, set_title] = useState('');

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
            className="flex items-center w-full bg-[#f5f5f5] px-4 relative border-b border-[#ddd] box-border overflow-hidden"
            style={{ height: styles.top_bar_height }}
        >
            <div className="flex flex-1 justify-start items-center gap-2">
                <EditorQuitButton onGoBackClick={onGoBackClick} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold">{title}</div>
            <div className="flex flex-1 justify-end items-center gap-2">
                <Button variant="outline" size="sm">
                    Print
                </Button>
            </div>
        </div>
    );
}
