import * as styles from '../../styles';
import { ZoomSlider } from '../ZoomSlider';

export function StatusBar({ editor }) {
    return (
        <div className="border-t border-[#d3d3d3] bg-[#f5f5f5] flex items-center" style={{ height: styles.status_bar_height }}>
            <ZoomSlider editor={editor} />
        </div>
    );
}
