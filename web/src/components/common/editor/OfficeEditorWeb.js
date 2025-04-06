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
