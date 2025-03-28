import { useEffect } from 'react';
import { Launch } from '../../../components/app/Launch';

export function Page() {
    useEffect(() => {
        window.document.body.style['overflow'] = 'hidden';
        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);

    return (
        <>
            <Launch />
        </>
    );
}
