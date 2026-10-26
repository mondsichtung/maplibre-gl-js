import {describe, test, expect} from 'vitest';
import fs from 'fs';
import {globSync} from 'glob';
import {transformWithOxc} from 'vite';

describe('ES2022 compatibility (https://github.com/maplibre/maplibre-gl-js/pull/7404)', () => {
    const chunks = globSync('dist/maplibre-gl-{shared,vector-tile-mlt}-*.mjs', {ignore: ['dist/*-dev.mjs', 'dist/*-dev-*.mjs']});
    for (const file of ['dist/maplibre-gl.mjs', 'dist/maplibre-gl-worker.mjs', ...chunks]) {
        test(`${file} does not require ES2022+ downleveling helpers`, async () => {
            const bundle = fs.readFileSync(file, 'utf8');

            const result = await transformWithOxc(bundle, file, {
                target: 'es2022',
            });

            expect(result.code).not.toContain('__publicField');
            expect(result.code).not.toContain('_defineProperty');
        });
    }
});
