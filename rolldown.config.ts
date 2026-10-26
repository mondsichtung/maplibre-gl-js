import {defineConfig, type RolldownOptions} from 'rolldown';
import {dts} from 'rolldown-plugin-dts';
import banner from './build/banner';
import packageJSON from './package.json' with {type: 'json'};

const production = process.env.BUILD === 'production';
const typesOnly = process.env.BUILD === 'types';
const outputPostfix = production ? '' : '-dev';

const dtsBundle: RolldownOptions = {
    input: {'maplibre-gl': 'src/index.ts'},
    output: {
        dir: 'dist',
        format: 'es',
    },
    external: Object.keys(packageJSON.dependencies),
    plugins: [dts({emitDtsOnly: true, generator: 'oxc'})],
};

/**
 * The main bundle and the worker are built together, so the code both of them run lands once in a
 * shared chunk, and code loaded on demand, the MLT decoder, in a chunk of its own. Chunk names carry a
 * content hash: a worker cached from an older release imports the chunks it was built with, never newer
 * ones, see https://github.com/maplibre/maplibre-gl-js/issues/8621.
 */
const bundleOptions: RolldownOptions = {
    platform: 'browser',
    treeshake: production,
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true,
        banner,
        minify: production ? true : 'dce-only',
        entryFileNames: `[name]${outputPostfix}.mjs`,
        chunkFileNames: (chunk) => chunk.isDynamicEntry
            ? `maplibre-gl-${chunk.name.replaceAll('_', '-')}${outputPostfix}-[hash].mjs`
            : `maplibre-gl-shared${outputPostfix}-[hash].mjs`,
    },
};

const config: RolldownOptions[] = defineConfig(typesOnly ? [dtsBundle] : [
    {...bundleOptions, input: {'maplibre-gl': 'src/index.ts', 'maplibre-gl-worker': 'src/source/worker.ts'}},
    ...(production ? [dtsBundle] : []),
]);

export default config;
