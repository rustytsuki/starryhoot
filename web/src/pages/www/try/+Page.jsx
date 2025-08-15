import { useEffect } from 'react';
import { TryIt } from '../../../components/www/try/TryIt';

export function Page() {
    useEffect(() => {
        window.document.body.style['overflow'] = 'hidden';

        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);

    return <TryIt></TryIt>;
}
