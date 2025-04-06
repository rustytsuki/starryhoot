import { get_roffice } from '../../../office/roffice';
import { OfficeEditorElectron } from "../../../editor/OfficeEditorElectron";

export class DocxEditorElectron extends OfficeEditorElectron {
    constructor(...args) {
        super(...args);
    }

    load_file(file_path) {
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
}