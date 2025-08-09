import { OfficeEditor } from './OfficeEditor';
import { getFileNameFromPath } from '../utils/path_util';
import { get_roffice } from '../office/roffice';

export class OfficeEditorElectron extends OfficeEditor {
    constructor(...args) {
        super(...args);
        this.resource_ = {};
    }

    async get_payload() {
        return { payload: this.options_.file_path, is_path: true };
    }

    async fetch_title() {
        const name = getFileNameFromPath(this.options_.file_path);
        return `${name.fileName}.${name.extension}`;
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
            return null;
        }
    }
}
