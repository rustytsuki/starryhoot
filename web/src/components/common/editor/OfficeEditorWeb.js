import { OfficeEditor } from './OfficeEditor';

export class OfficeEditorWeb extends OfficeEditor {
    constructor(...args) {
        super(...args);
    }

    async get_payload() {
        const response = await fetch(`/storage/${this.options_.file_id}/uploaded.docx`);

        if (!response.ok) {
            throw new Error('network response was not ok');
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        return { payload: bytes, is_path: false };
    }

    async fetch_title() {
        const response = await fetch('/api/drive/file', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'id': parseInt(this.options_.file_id) }),
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
