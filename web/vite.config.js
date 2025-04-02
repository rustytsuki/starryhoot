//  https://v4.vitejs.dev/config/

import react from '@vitejs/plugin-react-swc';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import ConditionalCompile from 'vite-plugin-conditional-compiler';

export default defineConfig(({ command, mode, ssrBuild }) => {
    console.log(`load vite config: command: ${command}, mode: ${mode}, ssrBuild: ${ssrBuild}`);
    console.log(`load vite config: NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`load vite config: host platform: ${process.platform}`);

    const isProduction = process.env.NODE_ENV === 'production';
    const isWin32 = process.platform === 'win32';

    // resolve vite CommonJS import issue
    // vite-plugin-commonjs not work
    // a compromise solution: https://github.com/intlify/bundle-tools/issues/220
    // https://vike.dev/broken-npm-package
    let ssr = ssrBuild
        ? {
              noExternal: [
                  'react-bootstrap',
                  'react-transition-group',
                  'dom-helpers',
                  '@fluentui/react-components',
                  '@restart/hooks',
                  '@restart/ui',
                  '@react-aria/ssr',
                  'dequal',
              ],
          }
        : {
              noExternal: [
                  '@fluentui/react-icons',
                  '@fluentui/react-file-type-icons',
                  '@fluentui/set-version',
                  '@fluentui/style-utilities',
                  '@fluentui/utilities',
                  '@fluentui/merge-styles',
                  '@fluentui/dom-utilities',
                  '@fluentui/theme',
              ],
          };

    let build = {
        manifest: false,
        ssrManifest: false,
        // https://vitejs.dev/config/build-options#build-minify
        minify: isProduction ? 'esbuild' : false,
        sourcemap: !isProduction,
    };

    // https://vitejs.dev/config/build-options#build-target
    if ('electron' === mode || 'web' === mode) {
        // Vite will replace 'modules' to ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
        build.target = 'modules';
    }

    const config = {
        base: '/',
        build,
        ssr,
        clearScreen: false,
        plugins: [
            react(),
            ConditionalCompile(),
            vike({
                prerender: true, // enable ssg
            }),
        ],
        server: {
            fs: {
                // https://vitejs.dev/config/server-options#server-fs-allow
                allow: ['..'],
            },
        },
    };

    // console.log(`load vite config: ${JSON.stringify(config)}`);

    return config;
});
