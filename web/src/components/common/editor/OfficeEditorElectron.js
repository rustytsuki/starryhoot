import { OfficeEditor } from './base/OfficeEditor';
import { base64_to_str } from '../utils/base64';
import { getFileNameFromPath } from '../utils/path_util';
import { load_roffice, get_roffice } from '../office/roffice';

export class OfficeEditorElectron extends OfficeEditor {
    constructor(...args) {
        super(...args);
        this.file_path_ = base64_to_str(this.payload_);
        this.resource_ = {};
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
        
        this.load_path(this.file_path_);
        this.register_request_anim_frame();
    }

    async fetch_title() {
        const name = getFileNameFromPath(this.file_path_);
        return `${name.fileName}.${name.extension}`;
    }

    load_path(file_path) {
        if (this.is_docx()) {
            this.load_docx(file_path);
        } else if (this.is_pptx()) {
            this.load_pptx(file_path);
        } else if (this.is_xlsx()) {
            this.load_xlsx(file_path);
        }
    }

    load_docx(file_path) {
        // load
        try {
            this.handle_ = get_roffice().roffice_open_docx_file(file_path);
        } catch (e) {
            console.error('docx load file error: ', e);
        }

        // compute
        try {
            get_roffice().roffice_docx_compute(this.handle_);
        } catch (e) {
            console.error('docx compute error: ', e);
        }
    }

    load_pptx(file_path) {
        // load
        try {
            this.handle_ = get_roffice().roffice_open_pptx_file(file_path);
        } catch (e) {
            console.error('pptx load file error: ', e);
        }

        // compute
        try {
            get_roffice().roffice_pptx_compute(this.handle_);
        } catch (e) {
            console.error('pptx compute error: ', e);
        }
    }

    load_xlsx(file_path) {
        // load
        try {
            this.handle_ = get_roffice().roffice_open_xlsx_file(file_path);
        } catch (e) {
            console.error('xlsx load file error: ', e);
        }

        // compute
        try {
            get_roffice().roffice_xlsx_compute(this.handle_);
        } catch (e) {
            console.error('xlsx compute error: ', e);
        }
    }

    fetch_resource(res_id) {
        if (!this.resource_[res_id]) {
            const resource = get_roffice().roffice_get_resource(this.handle_, res_id);
            if (resource) {
                const blob = new Blob([resource['data']], { type: resource['mime'] });
                const url = URL.createObjectURL(blob);
                let img = new Image();
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    this.render();
                };
                img.src = url;
                this.resource_[res_id] = img;
            }
        }

        let image = this.resource_[res_id];
        if (image && image.complete && image.naturalWidth > 0) {
            return image;
        } else {
            return null
        }
    }
}
