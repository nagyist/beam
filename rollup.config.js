import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
    entry: 'src/Beam.js',
    external: external,
    plugins: [
        json(),
        buble()
    ],
    targets: [
        {
            dest: pkg['main'],
            format: 'umd',
            moduleName: 'Beam',
            sourceMap: true
        },
        {
            dest: pkg['jsnext:main'],
            format: 'es',
            sourceMap: true
        }
    ]
};
