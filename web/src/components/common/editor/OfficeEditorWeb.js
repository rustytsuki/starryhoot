import { OfficeEditor } from './OfficeEditor';
import { load_roffice, get_roffice } from '../office/roffice';
import * as msgpackr from 'msgpackr';

async function getFileTree(id) {
    const response = await fetch('/drive/tree', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': parseInt(id) }),
    });

    const content = await response.json();
    if (content['success']) {
        let tree = content['payload'];
        return tree;
    }
}

export class OfficeEditorWeb extends OfficeEditor {
    constructor(...args) {
        super(...args);
        this.handle_ = 0;

        // msgpack test
        // const buf = new Uint8Array([0x93, 0x01, 0xa5, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x81, 0xa3, 0x6b, 0x65, 0x79, 0xa5, 0x76, 0x61, 0x6c, 0x75, 0x65]);
        let buf = new Uint8Array([1, 2, 3]);
        msgpackr.unpackMultiple(buf, (value) => {
            console.log(value);
        });
    }

    load_file(bytes) {
        throw '';
    }

    async load() {
        if (this.handle_) {
            return;
        }

        // ensure roffice
        await load_roffice();

        // fetch file data
        const response = await fetch(`/storage/${this.fid_}/uploaded.docx`);

        if (!response.ok) {
            throw new Error('network response was not ok');
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (this.destroyed_) {
            return;
        }

        this.load_file(bytes);
    }

    async unload() {
        if (this.handle_) {
            get_roffice().roffice_close_file(this.handle_);
            this.handle_ = 0;
        }
    }

    async update() {
        if (!this.is_dom_ready() || !this.handle_) {
            return;
        }

        let roffice = new get_roffice();

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

        // render
        let ctx = this.canvas_dom_.getContext('2d');

        roffice.roffice_render_viewport_to_canvas2d(this.handle_, ctx);
    }

    async fetch_title() {
        const response = await fetch("/api/drive/file", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "id": parseInt(this.fid_) }),
        });
        const content = await response.json();
        if (content['success']) {
            let file = content['payload'];
            return file.title;
        } else {
            return '';
        }
    }
}
