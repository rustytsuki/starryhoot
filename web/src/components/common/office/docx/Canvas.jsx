import { createRef, useEffect } from 'react';
import * as styles from '../../styles';

export function Canvas({ editor }) {
    const canvas_dom_ref_ = createRef();
    const viewport_dom_ref_ = createRef();
    const area_dom_ref_ = createRef();

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.set_viewport_dom(canvas_dom_ref_.current, viewport_dom_ref_.current, area_dom_ref_.current);

        return () => {
            editor.set_viewport_dom();
        };
    }, [editor]);

    return (
        <div id="edit-container" className="absolute w-full h-full">
            <canvas
                className="absolute z-0 w-full h-full"
                style={{ backgroundColor: styles.editor_canvas_bg }}
                ref={canvas_dom_ref_}
            />
            <div
                className="absolute z-0 w-full h-full overflow-scroll"
                ref={viewport_dom_ref_}
                onScroll={(e) => {
                    editor.on_scroll(e);
                }}
            >
                <div className="absolute w-full h-full" ref={area_dom_ref_} />
            </div>
        </div>
    );
}
