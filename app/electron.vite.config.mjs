import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

const config = defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {},
});

export default config;
