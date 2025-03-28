// https://vike.dev/onRenderClient
export { onRenderClient };

import ReactDOM from 'react-dom/client';
import { PageShell } from './PageShell';
import { getPageTitle } from './getPageTitle';
import BootstrapSSRProvider from 'react-bootstrap/SSRProvider';
import { SSRProvider as FluentSSRProvider } from '@fluentui/react-components';

let root;
function onRenderClient(pageContext) {
    const { Page } = pageContext;

    // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
    // to support SPA
    if (!Page) throw new Error('My onRenderClient() hook expects pageContext.Page to be defined');

    const container = document.getElementById('react-root');
    if (!container) throw new Error('DOM element #react-root not found');

    const page = (
        <BootstrapSSRProvider>
            <FluentSSRProvider>
                <PageShell pageContext={pageContext}>
                    <Page />
                </PageShell>
            </FluentSSRProvider>
        </BootstrapSSRProvider>
    );
    if (pageContext.isHydration) {
        root = ReactDOM.hydrateRoot(container, page);
    } else {
        if (!root) {
            root = ReactDOM.createRoot(container);
        }
        root.render(page);
    }
    document.title = getPageTitle(pageContext);
}
