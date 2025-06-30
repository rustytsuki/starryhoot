export const CMD_TYPE = {
    UNKNOWN: 0,
    CLEAR: 1,
    SAVE: 2,
    RESTORE: 3,
    SET_TRANSFORM: 4,
    TRANSLATE: 5,
    SCALE: 6,
    ROTATE: 7,
    BEGIN_PATH: 8,
    CLOSE_PATH: 9,
    MOVE_TO: 10,
    LINE_TO: 11,
    BEZIER_CURVE_TO: 12,
    QUADRATIC_CURVE_TO: 13,
    FILL_RECT: 14,
    STROKE_RECT: 15,
    FILL: 16,
    STROKE: 17,
    SET_LINE_WIDTH: 18,
    SET_LINE_DASH: 19,
    SET_GLOBAL_ALPHA: 20,
    SET_STROKE_COLOR: 21,
    SET_FILL_COLOR: 22,
    CLIP: 23,
    CLIP_RECT: 24,
    SET_FONT: 25,
    FILL_CHAR: 26,
    FILL_TEXT: 27,
    DRAW_IMAGE_FROM_RESOURCE: 28,
    DRAW_IMAGE2_FROM_RESOURCE: 29,
};

export function bcp47_to_default_facetype(code) {
    if ('zh-CN' == code) {
        return 'DengXian';
    } else if ('zh-TW' == code) {
        return 'PMingLiU';
    } else if ('ja-JP' == code) {
        return 'Yu Gothic';
    } else if ('ko-KR' == code) {
        return 'Malgun Gothic';
    } else if ('ar-SA' == code) {
        return 'Arial';
    }
}

export function fallback_typefaces() {
    return ['SimSun', 'Arial'];
}

export function color32_to_rgba_f(rgba) {
    const r = (rgba >>> 24) & 0xFF;
    const g = (rgba >>> 16) & 0xFF;
    const b = (rgba >>> 8)  & 0xFF;
    const a = rgba & 0xFF / 255;
    return `rgba(${r},${g},${b},${a})`;
}