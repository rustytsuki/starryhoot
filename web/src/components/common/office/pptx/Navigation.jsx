import { useState, useEffect } from 'react';
import { cn } from '../../../../shadcn/lib/utils.ts';
import { Button } from '../../../../shadcn/components/ui/button.tsx';

export function Navigation({ editor, shown, navi_bar_width }) {
    const [slides_count_, set_slides_count] = useState(0);
    const [cur_slide_index_, set_cur_slide_index] = useState(0);

    useEffect(() => {
        if (!editor) {
            return;
        }

        set_slides_count(editor.pptx_get_slides_count());

        return () => {};
    }, [editor]);

    useEffect(() => {
        if (editor) {
            console.log('select slide: ', cur_slide_index_ + 1);
            editor.pptx_select_slide(cur_slide_index_);
        }
    }, [cur_slide_index_]);

    function Slides() {
        const elements = [];
        for (let i = 0; i < slides_count_; ++i) {
            elements.push(
                <Button
                    key={i}
                    variant="link"
                    size="lg"
                    className={cn(i === cur_slide_index_ ? 'underline' : '')}
                    {...(i === cur_slide_index_ ? {} : { onClick: () => set_cur_slide_index(i) })}
                >
                    Slide {i + 1}
                </Button>
            );
        }
        return elements;
    }

    return (
        editor &&
        shown && (
            <div
                className="absolute top-0 left-0 bottom-0 border-r border-[#ddd] flex flex-col items-center overflow-x-hidden overflow-y-scroll"
                style={{ width: `${navi_bar_width}px` }}
            >
                {Slides()}
            </div>
        )
    );
}
