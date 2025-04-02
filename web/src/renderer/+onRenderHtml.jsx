// https://vike.dev/onRenderHtml
export { onRenderHtml };

import ReactDOMServer from 'react-dom/server';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import logoUrl from './logo.svg';
import { getPageTitle } from './getPageTitle';
import BootstrapSSRProvider from 'react-bootstrap/SSRProvider';
import {
    createDOMRenderer,
    RendererProvider,
    renderToStyleElements,
    SSRProvider as FluentSSRProvider,
} from '@fluentui/react-components';

function onRenderHtml(pageContext) {
    const { Page } = pageContext;

    // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
    // onRenderHtml() to support SPA
    if (!Page) throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined');

    // Alternativly, we can use an HTML stream, see https://vike.dev/stream
    const renderer = createDOMRenderer();
    const pageHtml = ReactDOMServer.renderToString(
        <RendererProvider renderer={renderer}>
            <BootstrapSSRProvider>
                <FluentSSRProvider>
                    <PageShell pageContext={pageContext}>
                        <Page />
                    </PageShell>
                </FluentSSRProvider>
            </BootstrapSSRProvider>
        </RendererProvider>
    );

    // Converting Fluent UI styles to style elements. 👇
    const style = ReactDOMServer.renderToStaticMarkup(<>{renderToStyleElements(renderer)}</>);

    // See https://vike.dev/head
    const title = getPageTitle(pageContext);
    const desc = pageContext.data?.description || pageContext.config.description || 'Demo of using Vike';
    let session_js = '';
    // #v-ifdef VITE_STARRYHOOT_WEB
    session_js = `<script src="/auth/session.js" defer ></script>`;
    // #v-endif

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(style)}
      </head>
      <body>
        ${dangerouslySkipEscape(session_js)}
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

    return {
        documentHtml,
        pageContext: {
            // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
        },
    };
}
