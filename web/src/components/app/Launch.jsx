import * as styles from '../common/styles.js';
import { cn } from '../../shadcn/lib/utils.ts';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { goto } from '../common/utils/route_util';

export function Launch() {
    async function openfile_electron() {
        starryhoot.open_file_dialog();
    }

    return (
        <div className="absolute w-full h-full" style={{ backgroundColor: styles.editor_canvas_bg }}>
            <Button onClick={openfile_electron}>Open File</Button>
            <Button
                variant="link"
                onClick={() => {
                    goto('/about');
                }}
            >
                About
            </Button>
        </div>
    );
}
