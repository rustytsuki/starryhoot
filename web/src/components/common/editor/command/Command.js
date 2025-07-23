export const CMD_TYPE = {
    UNKNOWN: 0,
    CLEAR: 1,
    SAVE: 2,
    RESTORE: 3,
    RESET_TRANSFORM: 4,
    SET_TRANSFORM: 5,
    TRANSLATE: 6,
    SCALE: 7,
    ROTATE: 8,
    BEGIN_PATH: 9,
    CLOSE_PATH: 10,
    MOVE_TO: 11,
    LINE_TO: 12,
    BEZIER_CURVE_TO: 13,
    QUADRATIC_CURVE_TO: 14,
    FILL_RECT: 15,
    STROKE_RECT: 16,
    FILL: 17,
    STROKE: 18,
    SET_LINE_WIDTH: 19,
    SET_LINE_DASH: 20,
    SET_GLOBAL_ALPHA: 21,
    SET_STROKE_COLOR: 22,
    SET_FILL_COLOR: 23,
    CLIP: 24,
    CLIP_RECT: 25,
    SET_FONT: 26,
    FILL_CHAR: 27,
    FILL_TEXT: 28,
    DRAW_IMAGE_FROM_RESOURCE: 29,
    DRAW_IMAGE2_FROM_RESOURCE: 30,
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
    const a = (rgba & 0xFF) / 255;
    return `rgba(${r},${g},${b},${a})`;
}