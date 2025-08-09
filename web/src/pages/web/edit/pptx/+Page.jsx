import { useState, useEffect } from 'react';
import { parse_uri_query } from '../../../../components/common/utils/route_util';
import { PPTXEditor } from '../../../../components/common/office/pptx/Editor';

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

    return <PPTXEditor options={options_} />;
}
