import { useState, useEffect } from 'react';
import { parse_uri_query } from '../../../../components/common/utils/route_util';
import { OfficeEditor } from '../../../../components/common/office/docx/Editor';

export function Page() {
    const [file_id_, set_file_id] = useState('');

    useEffect(() => {
        const query = parse_uri_query();
        set_file_id(query['id']);

        window.document.body.style['overflow'] = "hidden";

        return () => {
            window.document.body.style['overflow'] = "unset";
        };
    }, []);

    return <OfficeEditor fid={file_id_} />;
}
