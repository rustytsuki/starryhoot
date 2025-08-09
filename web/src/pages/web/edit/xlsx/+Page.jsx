import { useState, useEffect } from 'react';
import { parse_uri_query } from '../../../../components/common/utils/route_util';
import { XLSXEditor } from '../../../../components/common/office/xlsx/Editor';

export function Page() {
    const [options_, set_options] = useState(null);

    useEffect(() => {
        const query = parse_uri_query();
        set_options({ file_id: query['id'] });

        window.document.body.style['overflow'] = "hidden";

        return () => {
            window.document.body.style['overflow'] = "unset";
        };
    }, []);

    return <XLSXEditor options={options_} />;
}
