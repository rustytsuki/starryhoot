import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { SnappySlider } from '../../../shadcn/components/ui/snappy-slider.tsx';

export function ZoomSlider() {
    const [slider_value_, set_slider_value] = useState(50);

    const SLIDER_STATIONS = {
        0: '10%',
        50: '100%',
        100: '500%',
    };

    const slider_to_zoom = (value) => {
        if (50 == value) {
            return 100;
        } else if (value < 50) {
            return Math.round(10 + (value * 90) / 50);
        } else if (value > 50) {
            return Math.round(100 + (value - 50) * (400 / 50));
        }
    };

    const zoom_to_slider = (value) => {
        if (100 == value) {
            return 50;
        } else if (value < 100) {
            return ((value - 10) * 50) / 90;
        } else {
            return 50 + ((value - 100) * 50) / 400;
        }
    };

    const decrease = () => {
        const zoom_value = slider_to_zoom(slider_value_);
        let new_zoom_value = Math.floor((zoom_value - 1) / 10) * 10;
        if (new_zoom_value < 10) {
            new_zoom_value = 10;
        }
        const new_slider_value = zoom_to_slider(new_zoom_value);
        set_slider_value(new_slider_value);
    };

    const increase = () => {
        const zoom_value = slider_to_zoom(slider_value_);
        let new_zoom_value = Math.ceil((zoom_value + 1) / 10) * 10;
        if (new_zoom_value > 500) {
            new_zoom_value = 500;
        }
        const new_slider_value = zoom_to_slider(new_zoom_value);
        set_slider_value(new_slider_value);
    };

    return (
        <div className="relative w-[300px] flex items-center gap-1 pl-5 pr-5 ml-auto">
            <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" onClick={decrease}>
                <Minus className="w-3 h-3" />
            </button>
            <div className="flex-1">
                <SnappySlider
                    values={Object.keys(SLIDER_STATIONS).map(Number)}
                    defaultValue={50}
                    value={slider_value_}
                    onChange={set_slider_value}
                    min={0}
                    max={100}
                    snapping={true}
                    step={1}
                    config={{ snappingThreshold: 2 }}
                />
            </div>
            <button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" onClick={increase}>
                <Plus className="w-3 h-3" />
            </button>
            <button
                type="button"
                className="p-0 rounded hover:bg-gray-200 dark:hover:bg-gray-700 w-8 text-[12px] overflow-hidden"
            >
                {slider_to_zoom(slider_value_)}%
            </button>
        </div>
    );
}
