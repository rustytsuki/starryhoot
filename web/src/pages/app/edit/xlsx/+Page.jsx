import { useState, useEffect } from 'react';
import { parse_uri_query } from '../../../../components/common/utils/route_util';
import { XLSXEditor } from '../../../../components/common/office/xlsx/Editor';
import { base64_to_str } from '../../../../components/common/utils/base64';

export function Page() {
    const [options_, set_options] = useState(null);

    useEffect(() => {
        const query = parse_uri_query();
        set_options({ file_path: base64_to_str(query['id']) });

        window.document.body.style['overflow'] = 'hidden';

        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);

    return <XLSXEditor options={options_} />;
}
