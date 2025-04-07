import { OfficeEditor } from './OfficeEditor';
import { base64_to_str } from '../utils/base64';
import { getFileNameFromPath } from '../utils/path_util';
import { load_roffice, get_roffice } from '../office/roffice';

export class OfficeEditorElectron extends OfficeEditor {
    constructor(...args) {
        super(...args);
        this.file_path_ = base64_to_str(this.fid_);
    }

    load_file(file_path) {
        throw '';
    }

    async load() {
        if (this.handle_) {
            return;
        }

        // ensure roffice
        await load_roffice();

        if (this.destroyed_) {
            return;
        }
        
        this.load_file(this.file_path_);
    }

    async fetch_title() {
        const name = getFileNameFromPath(this.file_path_);
        return `${name.fileName}.${name.extension}`;
    }
}
