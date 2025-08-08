import * as styles from '../../styles';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Navigation } from './Navigation';
import { Canvas } from './Canvas';
import { MenuBar } from './MenuBar';
import { StatusBar } from './StatusBar';
// #v-ifdef VITE_STARRYHOOT_WEB||VITE_STARRYHOOT_WWW
import { PPTXEditorWeb as OfficeEditorClass } from './editor/PPTXEditorWeb';
// #v-elif VITE_STARRYHOOT_ELECTRON
import { PPTXEditorElectron as OfficeEditorClass } from './editor/PPTXEditorElectron';
// #v-endif

const LEFT_BAR_WIDTH = 300;

export function OfficeEditor({ fid }) {
    const [is_left_bar_shown_, set_left_bar_shown] = useState(false);
    const [resize_, set_resize] = useState(false);
    const [editor_, set_editor] = useState(null);
    const editor_ref = useRef();

    const on_resize = useCallback(() => {
        editor_ref.current && editor_ref.current.on_resize();
    }, []);

    function onNaviSwitch(is_shown) {
        set_left_bar_shown(is_shown);
        set_resize(!resize_);
    }

    useEffect(() => {
        if (!fid) {
            return;
        }

        (async () => {
            console.log(`open pptx file id: ${fid}`);
            try {
                set_editor(new OfficeEditorClass(fid));
            } catch (error) {
                console.error('error fetching file:', error);
            }
        })();

        return () => {
            set_editor(null);
            console.log(`close pptx file id: ${fid}`);
        };
    }, [fid]);

    useEffect(() => {
        if (!editor_) {
            return;
        }
        editor_ref.current = editor_;
        editor_.init();

        return () => {
            editor_.destroy();
            editor_ref.current = null;
        };
    }, [editor_]);

    useEffect(() => {
        if (!on_resize) {
            return;
        }

        window.addEventListener('resize', on_resize);

        return () => {
            window.removeEventListener('resize', on_resize);
        };
    }, [on_resize]);

    useEffect(() => {
        editor_ && editor_.on_resize();
    }, [resize_]);

    return (
        <div className="absolute left-0 top-0 w-full h-full">
            <div className="absolute w-full" style={{ height: styles.top_bar_height }}>
                <MenuBar editor={editor_} onNaviSwitch={onNaviSwitch} />
            </div>
            <div className="absolute w-full" style={{ top: styles.top_bar_height, bottom: styles.status_bar_height }}>
                <div
                    className="absolute top-0 left-0 bottom-0"
                    style={{ display: is_left_bar_shown_ ? 'block' : 'none', width: `${LEFT_BAR_WIDTH}px` }}
                >
                    <Navigation />
                </div>
                <div
                    className="absolute top-0 bottom-0 right-0"
                    style={{
                        backgroundColor: styles.editor_canvas_bg,
                        left: `${is_left_bar_shown_ ? LEFT_BAR_WIDTH : 0}px`,
                    }}
                >
                    <Canvas editor={editor_} />
                </div>
            </div>
            <div className="absolute bottom-0 w-full" style={{ height: styles.status_bar_height }}>
                <StatusBar />
            </div>
        </div>
    );
}
