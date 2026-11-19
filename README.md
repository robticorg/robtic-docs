# Robtic Docs

The documentation at **docs.robtic.org**: Discord (every bot and the dashboard), Hosting, and your Robtic account.
Plain Markdown in `content/`, built to static HTML by `build.ts` (Bun + marked), served by nginx. Same look as
robtic.org: Robtic's navy and blue, the Assistant typeface.

```
content/        one .md per page; front matter: title, description
  discord/ hosting/ account/
src/nav.ts      the sidebar — every page must be listed here once (the build checks)
src/layout.ts   the page shell: top bar, sidebar, article, "On this page", search dialog
public/         assets (css, js, font, logo) and shots/ (screenshots)
build.ts        content → dist/ (+ search.json, sitemap.xml, robots.txt, 404.html)
```

## Write a page

1. Add `content/<product>/<page>.md`:
   ```md
   ---
   title: Auto reply
   description: One sentence: what the reader gets from this page.
   ---
   ```
2. List it in `src/nav.ts`.
3. Screenshots go in `public/shots/…` and are shown with `![alt](/shots/x.webp "caption")` (click to zoom).
4. Callouts: a quote starting with `**Note**`, `**Tip**`, `**Warning**` or `**Important**`.
5. A numbered list is drawn as steps. Links to other pages use their path: `[Levels](/discord/system/levels)`.

## Run it

```bash
bun install
bun build.ts --watch     # http://localhost:4321, rebuilds on save
bun build.ts --check     # what CI runs: fails on a missing page, image or broken link
```

Dashboard screenshots are taken from robtic-discord's local test server (`bun run dev`, mock data) with a headless
browser, so they never show a real server.

## Deploy

Push to `main` → GitHub Actions checks, builds `ghcr.io/robticorg/robtic-docs:production` and calls the
`robtic-docs` Portainer stack webhook (`compose.yml`). Nginx Proxy Manager sends docs.robtic.org to
`http://robtic-docs:80` on the `proxy` network.
