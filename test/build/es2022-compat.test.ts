import {describe, test, expect} from 'vitest';
import fs from 'fs';
import {globSync} from 'glob';
import {transformWithOxc} from 'vite';

describe('ES2022 compatibility (https://github.com/maplibre/maplibre-gl-js/pull/7404)', () => {
    const sharedChunks = globSync('dist/maplibre-gl-shared-*.mjs', {ignore: ['dist/maplibre-gl-shared-dev.mjs', 'dist/maplibre-gl-shared-dev-*.mjs']});
    for (const file of ['dist/maplibre-gl.mjs', 'dist/maplibre-gl-worker.mjs', ...sharedChunks]) {
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
