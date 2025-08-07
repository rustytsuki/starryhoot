export { PageShell };

import React from 'react';
import { PageContextProvider } from './usePageContext';
import '../shadcn/styles/globals.css'

function PageShell({ pageContext, children }) {
    // In development mode, if your component is mounted within <React.StrictMode>, React will intentionally unmount and remount the component once.
    // As a result, the useEffect hook will run twice, which helps you detect potential issues in your side effects, such as memory leaks,
    // unnecessary network requests, or non-idempotent operations.
    return (
        // <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                {children}
            </PageContextProvider>
        // </React.StrictMode>
    );
}
