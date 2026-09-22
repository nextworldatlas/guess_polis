# Guess:Polis

Identify cities from satellite imagery. Live at **https://guesspolis.nextworldatlas.com**

React + Vite. This repository holds the **source**; the deployed site is built from it.

## Running locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the built dist/
```

## How deployment works

Hostinger's git integration can pull files but cannot run a build, so the build happens
on GitHub and only the result is handed over:

```
push to main
  -> GitHub Actions runs `npm ci && npm run build`
  -> force-pushes dist/ to the `deploy` branch
  -> webhook fires
  -> Hostinger pulls `deploy` into the subdomain's public_html
```

`main` is source only. `deploy` is generated — never commit to it or edit it by hand; the
workflow force-pushes an orphan commit over it on every build.

The workflow is [.github/workflows/deploy.yml](.github/workflows/deploy.yml). It fails the
build if `dist/.htaccess` is missing or if any city image referenced by the bundle has no
matching file, so a broken deploy is caught before it ships.

### Where the settings live

| What | Where |
|---|---|
| Repo, branch (`deploy`), target directory, webhook URL | hPanel -> Websites -> `guesspolis.nextworldatlas.com` -> Advanced -> GIT |
| Webhook receiver | GitHub -> Settings -> Webhooks |
| Manual redeploy if a webhook is missed | the **Deploy** button on that same hPanel page |

## City images

Each city is an entry in [src/data/cities.js](src/data/cities.js) pointing at
`/cities/<Name>.webp`, and the matching file lives in `public/cities/`. The filename must
match the `imagePath` string exactly, underscores included (`Kansas_City.webp`,
`Washington_DC.webp`).

Images are WebP q85, roughly 400 KB each, re-encoded from 1600x900 PNG originals that
averaged 3.3 MB. That took the image set from 269 MB to 32 MB and cut per-round download
about 8x. To add a city, encode it the same way:

```python
from PIL import Image
Image.open("City_Name.png").convert("RGB").save(
    "public/cities/City_Name.webp", "WEBP", quality=85, method=6)
```

then add its entry to `src/data/cities.js`.

The PNG originals are **not** in this repo. They are archived outside it at
`../guesspolis-original-png/`.

**Do not put the images in Git LFS.** Hostinger's git deploy has no LFS client and would
check out pointer files instead of images. `.gitattributes` is gitignored to stop that
happening by accident.

## Serving config

[public/.htaccess](public/.htaccess) is copied verbatim into every build. It forces HTTPS,
registers the WebP mime type, and sets caching: hashed assets and images are `immutable`
for a year, `index.html` is `no-cache`. Vite content-hashes the JS and CSS filenames, so a
new build invalidates itself and returning players pick it up immediately.

The one case caching will hide is replacing a city image **without changing its filename**.
Rename it, or bust the cache by hand.

## Base path

`vite.config.js` sets `base: '/'` because the site is served at the root of its own
subdomain. Components build asset URLs from `import.meta.env.BASE_URL`, so that one
setting is the single source of truth — don't hardcode paths in components.
