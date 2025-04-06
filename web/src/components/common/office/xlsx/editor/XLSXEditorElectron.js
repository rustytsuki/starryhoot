import { get_roffice } from '../../../office/roffice';
import { OfficeEditorElectron } from "../../../editor/OfficeEditorElectron";

export class XLSXEditorElectron extends OfficeEditorElectron {
    constructor(...args) {
        super(...args);
    }

    load_file(file_path) {
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
}