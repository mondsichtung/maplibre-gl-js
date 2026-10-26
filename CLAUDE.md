# CLAUDE.md

@AGENTS.md

The MoonStalkers fork of MapLibre GL JS. `FORK.md` holds the branches, the patches, the move to a new
upstream release and the release steps: read it before any git work here.

## Rules

- Node per `.nvmrc`: `eval "$(fnm env)" && fnm use 26` before any npm command.
- A patch is one commit on its `ms/<patch>` branch, in upstream's style: lowercase conventional
  subject (`perf:`, `fix:`), tests, docs. It never touches `CHANGELOG.md`, the version, this file or
  `FORK.md`.
- The `ms/*` branches point into the `moonstalkers` stack. Rebase with `--update-refs` so they move
  along, and with `--committer-date-is-author-date`.
- Edit a patch: `git commit --fixup=<patch commit>` on `moonstalkers`, then
  `git rebase --autosquash --update-refs --committer-date-is-author-date v<upstream>`.
- Add a patch: `git switch -c ms/<name> <previous patch>`, commit, then
  `git rebase --update-refs --committer-date-is-author-date --onto ms/<name> <previous patch> moonstalkers`,
  and add its row to `FORK.md`.
- A rewritten stack needs `git push --force-with-lease`. A push that fails with HTTP 500 has gone
  through with `git -c http.version=HTTP/1.1 push`.

## Tests

Run what covers the change:

- Unit: `npx vitest run --config vitest.config.unit.ts <paths>`.
- Build: `rm -rf dist && npm run build-dist && npm run test-build`. Chunks left by an older build fail
  the size test.
- Render: `npx vitest run test/integration/render/render.test.ts -t <test name>`.
  `is-supported-script/layout` fails here on stock upstream too.
- Bundler examples: `npx vitest run --config vitest.config.integration.ts test/integration/bundler`.

## Consumer

MoonStalkers (`../moonstalkers`) installs the release tarball. After a release, run
`bun add maplibre-gl@<tarball URL>` there and its map e2e.
