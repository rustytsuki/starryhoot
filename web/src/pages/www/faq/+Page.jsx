import { useEffect } from 'react';
import { Faq } from '../../../components/www/faq/Faq';

export function Page() {
    useEffect(() => {
        window.document.body.style['overflow'] = 'hidden';

        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);

    return <Faq></Faq>;
}
