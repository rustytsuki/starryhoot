import { OfficeEditorWasm } from "./base/OfficeEditorWasm";
import { load_roffice } from '../office/roffice';

export class OfficeEditorWWW extends OfficeEditorWasm {
    constructor(...args) {
        super(...args);
    }

    async load() {
        if (this.handle_) {
            return;
        }

        // ensure roffice
        await load_roffice();

        // fetch file data
        const response = await fetch(`/storage/${this.payload_}/uploaded.docx`);

        if (!response.ok) {
            throw new Error('network response was not ok');
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (this.destroyed_) {
            return;
        }

        this.load_bytes(bytes);
        this.register_request_anim_frame();
    }

    async fetch_title() {
        const response = await fetch("/api/drive/file", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "id": parseInt(this.payload_) }),
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
