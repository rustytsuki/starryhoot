import { OfficeEditor } from './OfficeEditor';
import { base64_to_str } from '../utils/base64';
import { getFileNameFromPath } from '../utils/path_util';
import { load_roffice, get_roffice } from '../office/roffice';

export class OfficeEditorElectron extends OfficeEditor {
    constructor(...args) {
        super(...args);
        this.is_loaded = false;
        this.file_path_ = base64_to_str(this.fid_);
    }

    async load() {
        if (this.is_loaded) {
            return;
        }

        // ensure roffice
        await load_roffice();
        
        console.log(`factorial(9): ${get_roffice().factorial(9)}`);

        this.is_loaded = true;
    }

    unload() {
        if (this.is_loaded) {
            this.is_loaded = false;
        }
    }

    update() {
        if (!this.is_dom_ready() || !this.is_loaded) {
            return;
        }
    }

    async fetch_title() {
        const name = getFileNameFromPath(this.file_path_);
        return `${name.fileName}.${name.extension}`;
    }
}
