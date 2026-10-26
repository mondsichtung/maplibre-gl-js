import * as esbuild from 'esbuild';
import {copyFileSync, existsSync, mkdirSync, readdirSync} from 'fs';

const distDir = 'node_modules/maplibre-gl/dist';
const workerSrc = `${distDir}/maplibre-gl-worker.mjs`;

if (!existsSync(workerSrc)) {
    console.error(
        `\nWorker file not found at:\n  ${workerSrc}\n\n` +
        'Run `npm run build-dist` (or `npm run build-prod`) in the repo root ' +
        'to produce the production maplibre-gl bundles, then retry.\n'
    );
    process.exit(1);
}

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    sourcemap: true
});

mkdirSync('dist', {recursive: true});
copyFileSync(workerSrc, 'dist/maplibre-gl-worker.mjs');
// The worker imports the content-hashed shared chunk next to it.
for (const file of readdirSync(distDir).filter((name) => /^maplibre-gl-shared-.+\.mjs$/.test(name))) {
    copyFileSync(`${distDir}/${file}`, `dist/${file}`);
}
