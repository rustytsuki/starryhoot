import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'path';

const config = defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        build: {
            rollupOptions: {
                input: {
                    editor: path.resolve(__dirname, 'src/preload/editor.js'),
                    index: path.resolve(__dirname, 'src/preload/index.js'),
                    tabs: path.resolve(__dirname, 'src/preload/tabs.js'),
                },
            },
        },
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {},
});

export default config;
