import * as msgpackr from 'msgpackr';
import { CMD_TYPE, bcp47_to_default_facetype, fallback_typefaces, color32_to_rgba_f } from './Command';

export function render_msgpack(ctx, buf, editor) {
    let stack = [];

    msgpackr.unpackMultiple(buf, (value) => {
        // console.log(value);
        
        stack.push(value);

        switch (stack[0]) {
            case CMD_TYPE.CLEAR:
                if (1 === stack.length - 1) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    const a = (stack[1] & 0xFF) / 255;
                    if (a != 0) {
                        ctx.fillStyle = color32_to_rgba_f(stack[1]);
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                    ctx.restore();
                    stack = [];
                }
                break;
            case CMD_TYPE.SAVE:
                ctx.save();
                stack = [];
                break;
            case CMD_TYPE.RESTORE:
                ctx.restore();
                stack = [];
                break;
            case CMD_TYPE.RESET_TRANSFORM:
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                stack = [];
                break;
            case CMD_TYPE.SET_TRANSFORM:
                if (6 === stack.length - 1) {
                    ctx.setTransform(stack[1], stack[2], stack[3], stack[4], stack[5], stack[6]);
                    stack = [];
                }
                break;
            case CMD_TYPE.TRANSLATE:
                if (2 === stack.length - 1) {
                    ctx.translate(stack[1], stack[2]);
                    stack = [];
                }
                break;
            case CMD_TYPE.SCALE:
                if (2 === stack.length - 1) {
                    ctx.scale(stack[1], stack[2]);
                    stack = [];
                }
                break;
            case CMD_TYPE.ROTATE:
                if (1 === stack.length - 1) {
                    ctx.rotate(stack[1]);
                    stack = [];
                }
                break;
            case CMD_TYPE.BEGIN_PATH:
                ctx.beginPath();
                stack = [];
                break;
            case CMD_TYPE.CLOSE_PATH:
                ctx.closePath();
                stack = [];
                break;
            case CMD_TYPE.MOVE_TO:
                if (2 === stack.length - 1) {
                    ctx.moveTo(stack[1], stack[2]);
                    stack = [];
                }
                break;
            case CMD_TYPE.LINE_TO:
                if (2 === stack.length - 1) {
                    ctx.lineTo(stack[1], stack[2]);
                    stack = [];
                }
                break;
            case CMD_TYPE.BEZIER_CURVE_TO:
                if (6 === stack.length - 1) {
                    ctx.bezierCurveTo(stack[1], stack[2], stack[3], stack[4], stack[5], stack[6]);
                    stack = [];
                }
                break;
            case CMD_TYPE.QUADRATIC_CURVE_TO:
                if (4 === stack.length - 1) {
                    ctx.quadraticCurveTo(stack[1], stack[2], stack[3], stack[4]);
                    stack = [];
                }
                break;
            case CMD_TYPE.FILL_RECT:
                if (4 === stack.length - 1) {
                    ctx.fillRect(stack[1], stack[2], stack[3], stack[4]);
                    stack = [];
                }
                break;
            case CMD_TYPE.STROKE_RECT:
                if (4 === stack.length - 1) {
                    ctx.strokeRect(stack[1], stack[2], stack[3], stack[4]);
                    stack = [];
                }
                break;
            case CMD_TYPE.FILL:
                ctx.fill();
                stack = [];
                break;
            case CMD_TYPE.STROKE:
                ctx.stroke();
                stack = [];
                break;
            case CMD_TYPE.SET_LINE_WIDTH:
                if (1 === stack.length - 1) {
                    ctx.lineWidth = stack[1];
                    stack = [];
                }
                break;
            case CMD_TYPE.SET_LINE_DASH:
                stack = [];
                break;
            case CMD_TYPE.SET_GLOBAL_ALPHA:
                if (1 === stack.length - 1) {
                    ctx.globalAlpha = stack[1];
                    stack = [];
                }
                break;
            case CMD_TYPE.SET_STROKE_COLOR:
                if (1 === stack.length - 1) {
                    ctx.strokeStyle = color32_to_rgba_f(stack[1]);
                    stack = [];
                }
                break;
            case CMD_TYPE.SET_FILL_COLOR:
                if (1 === stack.length - 1) {
                    ctx.fillStyle = color32_to_rgba_f(stack[1]);
                    stack = [];
                }
                break;
            case CMD_TYPE.CLIP:
                ctx.clip();
                stack = [];
                break;
            case CMD_TYPE.CLIP_RECT:
                if (4 === stack.length - 1) {
                    let region = new Path2D();
                    region.rect(stack[1], stack[2], stack[3], stack[4]);
                    ctx.clip(region);
                    stack = [];
                }
                break;
            case CMD_TYPE.SET_FONT:
                if (5 === stack.length - 1) {
                    let css = '';

                    if (stack[3]) {
                        css += 'bold';
                    }

                    if (stack[4]) {
                        if (css.length > 0) {
                            css += ' ';
                        }
                        css += 'italic';
                    }

                    if (css.length > 0) {
                        css += ' ';
                    }

                    css += `${stack[2]}px `;
                    css += `"${stack[1]}"`;

                    if (stack[5]) {
                        const ft = bcp47_to_default_facetype(stack[5]);
                        if (ft) {
                            css += `,"${ft}"`;
                        }
                    }

                    for (const ft of fallback_typefaces()) {
                        css += `,"${ft}"`;
                    }

                    ctx.font = css;

                    stack = [];
                }
                break;
            case CMD_TYPE.FILL_CHAR:
                if (3 === stack.length - 1) {
                    ctx.fillText(stack[1], stack[2], stack[3]);
                    stack = [];
                }
                break;
            case CMD_TYPE.FILL_TEXT:
                if (3 === stack.length - 1) {
                    ctx.fillText(stack[1], stack[2], stack[3]);
                    stack = [];
                }
                break;
            case CMD_TYPE.DRAW_IMAGE_FROM_RESOURCE:
                if (5 === stack.length - 1) {
                    const image = editor.fetch_resource(stack[1]);
                    if (image) {
                        ctx.drawImage(image, stack[2], stack[3], stack[4], stack[5]);
                    }
                    stack = [];
                }
                break;
            case CMD_TYPE.DRAW_IMAGE2_FROM_RESOURCE:
                if (9 === stack.length - 1) {
                    const image = editor.fetch_resource(stack[1]);
                    if (image) {
                        const l = img.width * stack[2];
                        const t = img.height * stack[3];
                        const r = img.width - img.width * stack[4];
                        const b = img.height - img.height * stack[5];

                        ctx.drawImage(image, l, t, r - l, b - t, stack[6], stack[7], stack[8], stack[9]);
                    }
                    stack = [];
                }
                break;
        }
    });
}
