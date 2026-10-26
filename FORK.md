# MoonStalkers fork of MapLibre GL JS

MapLibre GL JS as [MoonStalkers.com](https://moonstalkers.com) ships it: an upstream release
plus the patches listed below, nothing else. MoonStalkers installs it from the release tarball
attached to each `v<upstream>-ms.<n>` tag of this fork.

## Branches

- `ms/<patch>` holds one patch as one commit, in upstream's style and with its tests, so it can
  still go upstream as a PR. It sits on the upstream release tag, or on the patch it builds on.
- `moonstalkers` is the upstream release tag, every patch in the order below, this file and
  `CLAUDE.md`, and the version commit. Releases are tagged from it. Each `ms/<patch>` points at its
  commit in this stack.

Patches never touch `CHANGELOG.md` or the package version, the two files every upstream release
rewrites, so a rebase onto the next release only conflicts where upstream changed the patched code.

## Patches

| Branch | Change |
|---|---|
| `ms/shared-chunk` | The main thread and the worker load the code they share once, from a content-hashed `maplibre-gl-shared-[hash].mjs`. Upstream inlines it into both files since 6.13 ([#8672](https://github.com/maplibre/maplibre-gl-js/pull/8672)) and declined restoring it ([#8901](https://github.com/maplibre/maplibre-gl-js/issues/8901)). |
| `ms/mlt-lazy-chunk` | On `ms/shared-chunk`. The MLT decoder loads on demand from a content-hashed `maplibre-gl-vector-tile-mlt-[hash].mjs`, so styles without an `encoding: 'mlt'` source never download it. Vite 7 then needs `worker: {format: 'es'}`. |

## Moving to a new upstream release

```bash
git fetch upstream --tags
git switch moonstalkers
git reset --hard HEAD~1                                # drop the version commit
git rebase --update-refs --onto v6.17.0 v6.16.0        # replay the patches and the fork docs, moving each ms/<patch> along
```

Then update the base tag in the commands above and release.

## Releasing

Node per `.nvmrc`. `<version>` is the upstream version plus `-ms.<n>`, e.g. `6.16.0-ms.1`.

```bash
npm ci
npm version <version> --no-git-tag-version
git commit -am "chore: release <version>"
rm -rf dist                                  # chunk names carry a hash, so older builds' chunks would ship too
npm run build-dist && npm run test-build
npm pack                                     # maplibre-gl-<version>.tgz
git tag v<version>
git push --force-with-lease origin moonstalkers 'refs/heads/ms/*:refs/heads/ms/*' v<version>
gh release create v<version> maplibre-gl-<version>.tgz -R mondsichtung/maplibre-gl-js \
    --target moonstalkers --title v<version> --notes "MapLibre GL JS <upstream> with the patches in FORK.md."
```

MoonStalkers then points at the tarball:

```bash
bun add maplibre-gl@https://github.com/mondsichtung/maplibre-gl-js/releases/download/v<version>/maplibre-gl-<version>.tgz
```
