import {copyFileSync, mkdirSync, readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';

const dist = path.join(path.dirname(createRequire(import.meta.url).resolve('maplibre-gl/package.json')), 'dist');
const dest = path.join(process.cwd(), 'public', 'maplibre');

mkdirSync(dest, {recursive: true});
const chunks = readdirSync(dist).filter((name) => /^maplibre-gl-(shared|vector-tile-mlt)-.+\.mjs$/.test(name));
for (const file of ['maplibre-gl-worker.mjs', ...chunks]) {
    copyFileSync(path.join(dist, file), path.join(dest, file));
}
