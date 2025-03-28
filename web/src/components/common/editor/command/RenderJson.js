import { CMD_TYPE, bcp47_to_default_facetype, fallback_typefaces } from './Command';

export function render_json(ctx, commands_str) {
    const commands = JSON.parse(commands_str);

    for (const cmd of commands) {
        switch (cmd['_']) {
            case CMD_TYPE.CLEAR:
                ctx.fillStyle = `rgba(${cmd['r'] * 255},${cmd['g'] * 255},${cmd['b'] * 255},${cmd['a']})`;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                break;
            case CMD_TYPE.SAVE:
                ctx.save();
                break;
            case CMD_TYPE.RESTORE:
                ctx.restore();
                break;
            case CMD_TYPE.SET_TRANSFORM:
                ctx.setTransform(cmd['sx'], cmd['shy'], cmd['shx'], cmd['sy'], cmd['tx'], cmd['ty']);
                break;
            case CMD_TYPE.TRANSLATE:
                ctx.translate(cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.SCALE:
                ctx.scale(cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.ROTATE:
                ctx.rotate(cmd['a']);
                break;
            case CMD_TYPE.BEGIN_PATH:
                ctx.beginPath();
                break;
            case CMD_TYPE.CLOSE_PATH:
                ctx.closePath();
                break;
            case CMD_TYPE.MOVE_TO:
                ctx.moveTo(cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.LINE_TO:
                ctx.lineTo(cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.BEZIER_CURVE_TO:
                ctx.bezierCurveTo(cmd['cp1x'], cmd['cp1y'], cmd['cp2x'], cmd['cp2y'], cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.QUADRATIC_CURVE_TO:
                ctx.quadraticCurveTo(cmd['cpx'], cmd['cpy'], cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.FILL_RECT:
                ctx.fillRect(cmd['x'], cmd['y'], cmd['w'], cmd['h']);
                break;
            case CMD_TYPE.STROKE_RECT:
                ctx.strokeRect(cmd['x'], cmd['y'], cmd['w'], cmd['h']);
                break;
            case CMD_TYPE.FILL:
                ctx.fill();
                break;
            case CMD_TYPE.STROKE:
                ctx.stroke();
                break;
            case CMD_TYPE.SET_LINE_WIDTH:
                ctx.lineWidth = cmd['w'];
                break;
            case CMD_TYPE.SET_LINE_DASH:
                break;
            case CMD_TYPE.SET_GLOBAL_ALPHA:
                ctx.globalAlpha = cmd['a'];
                break;
            case CMD_TYPE.SET_STROKE_COLOR:
                ctx.strokeStyle = `rgba(${cmd['r'] * 255},${cmd['g'] * 255},${cmd['b'] * 255},${cmd['a']})`;
                break;
            case CMD_TYPE.SET_FILL_COLOR:
                ctx.fillStyle = `rgba(${cmd['r'] * 255},${cmd['g'] * 255},${cmd['b'] * 255},${cmd['a']})`;
                break;
            case CMD_TYPE.CLIP_RECT:
                let region = new Path2D();
                region.rect(cmd['x'], cmd['y'], cmd['w'], cmd['h']);
                ctx.clip(region);
                break;
            case CMD_TYPE.SET_FONT:
                let css = '';

                if (cmd['b']) {
                    css += 'bold';
                }

                if (cmd['i']) {
                    if (css.length > 0) {
                        css += ' ';
                    }
                    css += 'italic';
                }

                if (css.length > 0) {
                    css += ' ';
                }

                css += `${cmd['s']}px `;
                css += `"${cmd['f']}"`;

                if (cmd['l']) {
                    const ft = bcp47_to_default_facetype(cmd['l']);
                    if (ft) {
                        css += `,"${ft}"`;
                    }
                }

                for (const ft of fallback_typefaces()) {
                    css += `,"${ft}"`;
                }

                ctx.font = css;

                break;
            case CMD_TYPE.FILL_CHAR:
                ctx.fillText(cmd['c'], cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.FILL_TEXT:
                ctx.fillText(cmd['t'], cmd['x'], cmd['y']);
                break;
            case CMD_TYPE.DRAW_IMAGE:
                break;
            case CMD_TYPE.DRAW_IMAGE_SRC_DST:
                break;
        }
    }
}
