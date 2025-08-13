import { useState, useEffect } from 'react';
import { NavigationBar } from '../../../components/www/navi/NavigationBar';
import { UniEditor } from '../../../components/common/office/UniEditor';
import { go_back } from '../../../components/common/utils/route_util';
import { getFileNameFromPath } from '../../common/utils/path_util';
import { MIMEType } from '../../common/MimeType';

export function File({ payload }) {
    const [editor_type, set_editor_type] = useState('');
    const [editor_options, set_editor_options] = useState(null);

    useEffect(() => {
        if (payload) {
            const { fileName, extension } = getFileNameFromPath(payload.url);
            if ('docx' === extension) {
                set_editor_type(MIMEType.DOCX);
            } else if ('pptx' === extension) {
                set_editor_type(MIMEType.PPTX);
            } else if ('xlsx' === extension) {
                set_editor_type(MIMEType.XLSX);
            }

            set_editor_options({ file_url: payload.url, title: payload.title });
        }
        return () => {};
    }, [payload]);

    return (
        <NavigationBar>
            <UniEditor editor_type={editor_type} editor_options={editor_options} onGoBackClick={go_back} />
        </NavigationBar>
    );
}
