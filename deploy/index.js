import commandLineArgs from 'command-line-args';
import * as builder from './src/builder.js';

const optionDefinitions = [
    { name: 'target', alias: 't', type: String },
    { name: 'upload', alias: 'u', type: Boolean },
];

const config = commandLineArgs(optionDefinitions);

async function main() {
    let targets = config['target'].split(',');
    for (let i in targets) {
        if (await builder.build_electron(targets[i])) {
            console.error(`build: ${targets[i]} failed!`);
        }
    }
}

main();
