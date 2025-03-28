import { useEffect } from 'react';
import { Tabs } from '../../../components/app/Tabs';

export function Page() {
    useEffect(() => {
        window.document.body.style['overflow'] = 'hidden';
        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);
    return (
        <>
            <Tabs />
        </>
    );
}
