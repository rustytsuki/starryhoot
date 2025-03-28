import { useEffect } from 'react';
import { About } from '../../../components/common/About';

export { Page };

function Page() {
    useEffect(() => {
        window.document.body.style['overflow'] = 'hidden';
        return () => {
            window.document.body.style['overflow'] = 'unset';
        };
    }, []);
    return (
        <>
            <About />
        </>
    );
}
