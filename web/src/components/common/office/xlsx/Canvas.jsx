import { createRef, useEffect } from 'react';
import styles from './Canvas.module.scss';

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
        <div id="edit-container" className={styles.root}>
            <canvas className={styles.canvas} ref={canvas_dom_ref_} />
            <div
                className={styles.viewport}
                ref={viewport_dom_ref_}
                onScroll={(e) => {
                    editor.on_scroll(e);
                }}
            >
                <div className={styles.area} ref={area_dom_ref_} />
            </div>
        </div>
    );
}
