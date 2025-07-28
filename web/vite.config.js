//  https://v4.vitejs.dev/config/

import react from '@vitejs/plugin-react-swc';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import ConditionalCompile from 'vite-plugin-conditional-compiler';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    console.log(`load vite config: command: ${command}, mode: ${mode}, ssrBuild: ${isSsrBuild}`);
    console.log(`load vite config: NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`load vite config: host platform: ${process.platform}`);

    const isProduction = process.env.NODE_ENV === 'production';
    const isWin32 = process.platform === 'win32';

    // resolve vite CommonJS import issue
    // vite-plugin-commonjs not work
    // a compromise solution: https://github.com/intlify/bundle-tools/issues/220
    // https://vike.dev/broken-npm-package

    let cjs_interrop = cjsInterop({
        // Add broken npm package here
        dependencies: ['react-bootstrap/**'],
    });

    let ssr = isSsrBuild
        ? {
              noExternal: [
                  'react-bootstrap',
                  'react-transition-group',
                  'dom-helpers',
                  '@restart/hooks',
                  '@restart/ui',
                  '@react-aria/ssr',
                  'dequal',
              ],
          }
        : {
              noExternal: [],
          };

    let build = {
        manifest: false,
        ssrManifest: false,
        // https://vitejs.dev/config/build-options#build-minify
        minify: isProduction ? 'esbuild' : false,
        sourcemap: !isProduction,
    };

    // https://vitejs.dev/config/build-options#build-target
    // Vite will replace 'modules' to ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
    build.target = 'modules';

    const config = {
        base: 'www_publish' === mode ? '/starryhoot' : '/',
        build,
        ssr,
        clearScreen: false,
        plugins: [
            react(),
            ConditionalCompile(),
            vike({
                prerender: true, // enable ssg
            }),
            cjs_interrop,
            tailwindcss()
        ],
        resolve: {
            alias: {
                '@': new URL('./', import.meta.url).pathname,
            },
        },
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
