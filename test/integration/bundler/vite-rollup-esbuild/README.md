# Vite 7 (Rollup/esbuild) example

Minimal Vite 7 (Rollup/esbuild) app exercising the ESM build:

- `import {Map} from 'maplibre-gl'` and `import 'maplibre-gl/dist/maplibre-gl.css'` resolve via the package's `exports` field.
- `import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'` bundles the worker and returns the URL. `setWorkerUrl(workerUrl)` points MapLibre at it.
- `worker: {format: 'es'}` in `vite.config.ts`: the worker loads the MLT decoder on demand, and Vite 7 cannot split an `iife` worker.

## Setup

From the repo root, build the parent package once so `dist/` is populated:

```bash
npm install
npm run build-dist
```

Then in this directory:

```bash
npm install
npm run dev
```
