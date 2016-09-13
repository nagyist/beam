import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
    entry: 'src/Beam.js',
    external: external,
    plugins: [
        json(),
        babel()
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
