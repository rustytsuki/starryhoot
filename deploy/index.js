import commandLineArgs from 'command-line-args';
import * as builder from './src/builder.js';
import * as publisher from './src/publisher.js';
import { fetch_kernel, fetch_kernel_auto } from './src/fetch_kernel.js';

const optionDefinitions = [
    { name: 'fetch', alias: 'f', type: Boolean },
    { name: 'target', alias: 't', type: String },
    { name: 'publish', alias: 'p', type: Boolean },
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    if (config['fetch']) {
        process.exit(await fetch_kernel_auto());
    }

    if (await fetch_kernel('wasm32-unknown-emscripten')) {
        console.error(`fetch kernel error: wasm32-unknown-emscripten failed!`);
        process.exit(1);
    }

    let has_error = false;
    let targets = config['target'].split(',');
    for (let i in targets) {
        const target = targets[i];
        if (await fetch_kernel(target)) {
            has_error = true;
            console.error(`fetch kernel error: ${target} failed!`);
            continue;
        }

        if (await builder.build_all(target)) {
            has_error = true;
            console.error(`build: ${target} failed!`);
            continue;
        }

        if (config['publish']) {
            if (await publisher.upload_assets(target)) {
                has_error = true;
                continue;
            }
        }
    }
    if (has_error) {
        process.exit(1);
    }
}

main();
