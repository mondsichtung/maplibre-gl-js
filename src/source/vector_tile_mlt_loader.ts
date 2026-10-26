import type {VectorTileLike} from '@maplibre/vt-pbf';

let MLTVectorTile: new (buffer: ArrayBuffer) => VectorTileLike;
let loading: Promise<void> | undefined;

/**
 * Loads the MLT decoder, which lives in its own chunk so styles without an `encoding: 'mlt'` source never download it.
 * A failed load is retried on the next call.
 */
export function loadMLTDecoder(): Promise<void> {
    loading ??= import('./vector_tile_mlt.ts').then((module) => {
        MLTVectorTile = module.MLTVectorTile;
    }, (err) => {
        loading = undefined;
        throw err;
    });
    return loading;
}

/**
 * Decodes an MLT tile with the decoder {@link loadMLTDecoder} loaded.
 * Synchronous, for the query path, which cannot wait for a load.
 */
export function decodeMLTTile(buffer: ArrayBuffer): VectorTileLike {
    if (!MLTVectorTile) throw new Error('The MLT decoder is not loaded, await loadMLTDecoder() first');
    return new MLTVectorTile(buffer);
}
