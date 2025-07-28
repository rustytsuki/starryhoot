import styles from './Editor.module.scss';
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
        let is_mounted = true;

        if (!fid) {
            return;
        }

        (async () => {
            if (is_mounted) {
                console.log(`open pptx file id: ${fid}`);
                try {
                    set_editor(new OfficeEditorClass(fid));
                } catch (error) {
                    console.error('error fetching file:', error);
                }
            }
        })();

        return () => {
            is_mounted = false;
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
        <div className={styles.root}>
            <div className={styles.menu}>
                <MenuBar editor={editor_} onNaviSwitch={onNaviSwitch} />
            </div>
            <div className={styles.editor}>
                <div
                    className={styles.left}
                    style={{ display: is_left_bar_shown_ ? 'block' : 'none', width: `${LEFT_BAR_WIDTH}px` }}
                >
                    <Navigation />
                </div>
                <div
                    className={styles.canvas}
                    style={{
                        left: `${is_left_bar_shown_ ? LEFT_BAR_WIDTH : 0}px`,
                        right: '0px',
                    }}
                >
                    <Canvas editor={editor_} />
                </div>
            </div>
            <div className={styles.statusbar}>
                <StatusBar />
            </div>
        </div>
    );
}
