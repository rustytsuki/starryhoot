import { useEffect } from 'react';
import { NavigationBar } from '../navi/NavigationBar';
import FaqPPTXUrl from './Faq.pptx';

export function Faq() {
    useEffect(() => {
        fetch(FaqPPTXUrl)
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
                const bytes = new Uint8Array(buffer);
                // Do something with bytes
                console.log('Faq.pptx size is ', bytes.length, 'bytes');
            });
    }, []);

    return (
        <>
            <NavigationBar>
                <p className="text-center text-2xl">Frequently Asked Questions</p>
            </NavigationBar>
        </>
    );
}
