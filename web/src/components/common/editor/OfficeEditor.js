import { load_roffice, get_roffice } from '../office/roffice';
// #v-ifdef VITE_STARRYHOOT_ELECTRON
import { render_msgpack } from './command/RenderMsgpack';
// #v-endif

export const OfficeEditorType = {
    DOCX: 1,
    PPTX: 2,
    XLSX: 3,
};

export class OfficeEditor {
    constructor(editor_type, payload) {
        this.type_ = editor_type;
        this.payload_ = payload;
        this.handle_ = 0;
        this.destroyed_ = false;

        this.canvas_dom_ = null;
        this.viewport_dom_ = null;
        this.area_dom_ = null;
    }

    is_docx() {
        return OfficeEditorType.DOCX === this.type_;
    }

    is_pptx() {
        return OfficeEditorType.PPTX === this.type_;
    }

    is_xlsx() {
        return OfficeEditorType.XLSX === this.type_;
    }

    file_type_str() {
        if (this.is_docx()) {
            return 'docx';
        } else if (this.is_pptx()) {
            return 'pptx';
        } else if (this.is_xlsx()) {
            return 'xlsx';
        }
    }

    async load() {
        if (this.handle_) {
            return;
        }

        // ensure roffice
        await load_roffice();

        // fetch file data
        const { payload, is_path } = await this.get_payload();

        if (this.destroyed_) {
            return;
        }

        this.load_file(payload, is_path);
        this.register_request_anim_frame();
    }

    unload() {
        if (this.handle_) {
            get_roffice().roffice_close_file(this.handle_);
            this.handle_ = 0;
        }
    }

    async get_payload() {
        throw '';
    }

    load_file(payload, is_path) {
        const file_type_str = this.file_type_str();
        let office_open_func;
        let office_compute_func;

        if (this.is_docx()) {
            office_open_func = is_path ? get_roffice().roffice_open_docx_file : get_roffice().roffice_open_docx_u8array;
            office_compute_func = get_roffice().roffice_docx_compute;
        } else if (this.is_pptx()) {
            office_open_func = is_path ? get_roffice().roffice_open_pptx_file : get_roffice().roffice_open_pptx_u8array;
            office_compute_func = get_roffice().roffice_pptx_compute;
        } else if (this.is_xlsx()) {
            office_open_func = is_path ? get_roffice().roffice_open_xlsx_file : get_roffice().roffice_open_xlsx_u8array;
            office_compute_func = get_roffice().roffice_xlsx_compute;
        }

        try {
            this.handle_ = office_open_func(payload);
        } catch (e) {
            console.error(`${file_type_str} load file error: `, e);
        }

        // compute
        try {
            office_compute_func(this.handle_);
        } catch (e) {
            console.error(`${file_type_str} compute error: `, e);
        }
    }

    register_request_anim_frame() {
        if (this.handle_) {
            let roffice = get_roffice();
            roffice.roffice_request_anim_frame(this.handle_, () => {
                this.render();
            });
        }
    }

    update() {
        if (!this.is_dom_ready() || !this.handle_) {
            return;
        }

        let roffice = get_roffice();

        const scroll_x = this.viewport_dom_['scrollLeft'];
        const scroll_y = this.viewport_dom_['scrollTop'];
        const viewport_w = this.viewport_dom_['clientWidth'];
        const viewport_h = this.viewport_dom_['clientHeight'];
        const canvas_w = this.canvas_dom_['width'];
        const canvas_h = this.canvas_dom_['height'];

        roffice.roffice_set_canvas(this.handle_, canvas_w, canvas_h, window.devicePixelRatio);
        const scroll_bar_x = roffice.roffice_scroll_bar_x(this.handle_);
        const scroll_bar_y = roffice.roffice_scroll_bar_y(this.handle_);

        // compute scroll size ratio
        const scale_x = viewport_w / scroll_bar_x.size;
        const scale_y = viewport_h / scroll_bar_y.size;

        this.area_dom_['style']['width'] = `${scroll_bar_x.total * scale_x}px`;
        this.area_dom_['style']['height'] = `${scroll_bar_y.total * scale_y}px`;

        roffice.roffice_scroll_to(this.handle_, scroll_x / scale_x, scroll_y / scale_y);
    }

    render() {
        if (!this.is_dom_ready() || !this.handle_) {
            return;
        }

        let roffice = get_roffice();

        let ctx = this.canvas_dom_.getContext('2d');

        // #v-ifdef VITE_STARRYHOOT_WEB||VITE_STARRYHOOT_WWW
        roffice.roffice_render_viewport_to_canvas2d(this.handle_, ctx);
        // #v-elif VITE_STARRYHOOT_ELECTRON
        const buf = roffice.roffice_render_viewport_to_cmd_msgpack(this.handle_);
        render_msgpack(ctx, buf, this);
        // #v-endif
    }

    async fetch_title() {
        throw '';
    }

    set_viewport_dom(canvas_dom, viewport_dom, area_dom) {
        this.canvas_dom_ = canvas_dom;
        this.viewport_dom_ = viewport_dom;
        this.area_dom_ = area_dom;

        if (this.canvas_dom_) {
            this.on_resize();
        }
    }

    is_dom_ready() {
        return this.canvas_dom_ && this.viewport_dom_ && this.area_dom_;
    }

    init() {
        this.load()
            .then(() => {
                if (this.destroyed_) {
                    this.set_viewport_dom();
                    this.unload();
                    return;
                }

                console.log('office editor init.');

                // first update
                this.on_resize();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    destroy() {
        this.destroyed_ = true;
        console.log('docx editor destroy.');
        this.set_viewport_dom();
        this.unload();
    }

    on_resize = () => {
        if (!this.is_dom_ready()) {
            return;
        }

        const w = this.viewport_dom_['clientWidth'];
        const h = this.viewport_dom_['clientHeight'];

        this.canvas_dom_['style']['width'] = `${w}px`;
        this.canvas_dom_['style']['height'] = `${h}px`;
        this.canvas_dom_['width'] = Math.round(this.canvas_dom_['clientWidth'] * window.devicePixelRatio);
        this.canvas_dom_['height'] = Math.round(this.canvas_dom_['clientHeight'] * window.devicePixelRatio);

        // console.log(`resize canvas to (${this.canvas_dom_.width}, ${this.canvas_dom_.height})`);

        let ctx = this.canvas_dom_.getContext('2d');
        ctx['imageSmoothingEnabled'] = false;

        this.update();
    };

    on_scroll = (e) => {
        const x = e.currentTarget.scrollLeft;
        const y = e.currentTarget.scrollTop;

        // console.log(`viewport scroll to (${x}, ${y})`);

        this.update();
    };

    // The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete)
    on_keydown = (e) => {};
}
