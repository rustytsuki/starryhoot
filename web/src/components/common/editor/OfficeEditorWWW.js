import { OfficeEditor } from "./OfficeEditor";

export class OfficeEditorWWW extends OfficeEditor {
    constructor(...args) {
        super(...args);
    }

    async get_payload() {
        const response = await fetch(this.options_.file_url);

        if (!response.ok) {
            throw new Error('network response was not ok');
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        return { payload: bytes, is_path: false };
    }

    async fetch_title() {
        return this.options_.title;
    }
}
