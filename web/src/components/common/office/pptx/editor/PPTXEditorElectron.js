import { get_roffice } from '../../../office/roffice';
import { OfficeEditorElectron } from "../../../editor/OfficeEditorElectron";

export class PPTXEditorElectron extends OfficeEditorElectron {
    constructor(...args) {
        super(...args);
    }

    load_file(file_path) {
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
}