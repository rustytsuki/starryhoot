import { OfficeEditor } from './OfficeEditor';
import { get_roffice } from '../../office/roffice';

export class OfficeEditorWasm extends OfficeEditor {
    constructor(...args) {
        super(...args);
    }

    async load() {
        throw '';
    }

    async fetch_title() {
        throw '';
    }

    load_bytes(bytes) {
        if (this.is_docx()) {
            this.load_docx(bytes);
        } else if (this.is_pptx()) {
            this.load_pptx(bytes);
        } else if (this.is_xlsx()) {
            this.load_xlsx(bytes);
        }
    }

    load_docx(bytes) {
        try {
            this.handle_ = get_roffice().roffice_open_docx_u8array(bytes);
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

    load_pptx(bytes) {
        try {
            this.handle_ = get_roffice().roffice_open_pptx_u8array(bytes);
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

    load_xlsx(bytes) {
        try {
            this.handle_ = get_roffice().roffice_open_xlsx_u8array(bytes);
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
}
