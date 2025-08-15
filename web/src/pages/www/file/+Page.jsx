import { useState, useEffect } from 'react';
import { base64_to_str } from '../../../components/common/utils/base64.js';
import { parse_uri_query } from '../../../components/common/utils/route_util.js';
import { File } from '../../../components/www/file/File.jsx';

export function Page() {
    const [payload, set_payload] = useState(null);

    useEffect(() => {
        const query = parse_uri_query();
        set_payload(JSON.parse(base64_to_str(query['payload'])));

        window.document.body.style['overflow'] = 'hidden';

        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);

    return <File payload={payload} />;
}
