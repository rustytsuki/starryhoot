import { get_roffice } from '../../../office/roffice';
import { OfficeEditorWeb } from "../../../editor/OfficeEditorWeb";

export class PPTXEditorWeb extends OfficeEditorWeb {
    constructor(...args) {
        super(...args);
    }

    load_file(bytes) {
        // load
        try {
            this.handle_ = get_roffice().roffice_open_pptx_u8array(bytes);
        } catch (e) {
            console.error('pptx load file error: ', e);
        }
        this.bytes = null;

        // compute
        try {
            get_roffice().roffice_pptx_compute(this.handle_);
        } catch (e) {
            console.error('pptx compute error: ', e);
        }
    }
}