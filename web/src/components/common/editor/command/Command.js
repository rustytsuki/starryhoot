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
    CLIP_RECT: 23,
    SET_FONT: 24,
    FILL_CHAR: 25,
    FILL_TEXT: 26,
    DRAW_IMAGE: 27,
    DRAW_IMAGE_SRC_DST: 28,
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

