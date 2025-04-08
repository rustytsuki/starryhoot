import commandLineArgs from 'command-line-args';
import * as builder from './src/builder.js';
import { fetch_kernel } from './src/fetch_kernel.js';

const optionDefinitions = [
    { name: 'fetch', alias: 'f', type: Boolean },
    { name: 'target', alias: 't', type: String },
    { name: 'upload', alias: 'u', type: Boolean },
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    if (config['fetch']) {
        let targets = config['target'].split(',');
        for (let i in targets) {
            if (await fetch_kernel(targets[i])) {
                console.error(`fetch kernel: ${targets[i]} failed!`);
                return 1;
            }
        }
        return 0;
    }

    let targets = config['target'].split(',');
    for (let i in targets) {
        if (await builder.build_electron(targets[i])) {
            console.error(`build: ${targets[i]} failed!`);
        }
    }
}

main();
