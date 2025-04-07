import { OfficeEditor } from './OfficeEditor';
import { load_roffice } from '../office/roffice';

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
