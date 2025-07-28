export { PageShell };

import React from 'react';
import { PageContextProvider } from './usePageContext';
import "bootstrap/scss/bootstrap.scss";
import 'bootstrap-icons/font/bootstrap-icons.scss';
import '../shadcn/styles/globals.css'

function PageShell({ pageContext, children }) {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                {children}
            </PageContextProvider>
        </React.StrictMode>
    );
}
