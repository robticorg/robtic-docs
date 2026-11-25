import { PRODUCTS, productOf, type Product } from './nav.ts';

// The page shell: top bar (logo, products, search), sidebar for the current product, the article, and "On this page".
// Plain HTML + one stylesheet + one small script (search, mobile menu, copy buttons, the active heading).

export const ORIGIN = 'https://docs.robtic.org';

export interface PageMeta { path: string; url: string; title: string; description: string }
export interface Heading { level: number; id: string; text: string }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS: Record<string, string> = {
    discord: '<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};
export const icon = (name: string, size = 18) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

function sidebar(product: Product | null, current: string, titles: Map<string, string>): string {
    if (!product) return '';
    const groups = product.groups.map((g) => `
        <div class="side-group">
            <div class="side-h">${esc(g.title)}</div>
            ${g.pages.map((p) => `<a class="side-link${p === current ? ' on' : ''}" href="${urlOf(p)}"${p === current ? ' aria-current="page"' : ''}>${esc(titles.get(p) ?? p)}</a>`).join('')}
        </div>`).join('');
    return `<nav class="side" id="side" aria-label="${esc(product.title)} pages"><div class="side-product">${icon(product.icon, 16)} ${esc(product.title)}</div>${groups}</nav>`;
}

export const urlOf = (path: string) => (path === 'index' ? '/' : `/${path.replace(/\/index$/, '')}`);

function shell(meta: PageMeta, body: string, opts: { product: Product | null; bodyClass?: string }): string {
    const canonical = ORIGIN + meta.url;
    const title = meta.path === 'index' ? 'Robtic Docs' : `${meta.title} · Robtic Docs`;
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}/assets/logo.png">
<meta name="theme-color" content="#070b14">
<link rel="icon" href="/assets/logo.png">
<link rel="preload" href="/assets/assistant.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/assets/docs.css">
</head>
<body class="${opts.bodyClass ?? ''}">
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
    <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open the menu" aria-controls="side" aria-expanded="false">${icon('menu', 20)}</button>
    <a class="brand" href="/"><img src="/assets/logo.png" alt="" width="28" height="28"><span><b>Robtic</b> Docs</span></a>
    <nav class="products" aria-label="Products">
        ${PRODUCTS.map((p) => `<a href="/${p.key}"${opts.product?.key === p.key ? ' class="on" aria-current="true"' : ''}>${esc(p.title)}</a>`).join('')}
    </nav>
    <button class="search-btn" id="search-btn" aria-label="Search the docs">${icon('search', 16)}<span>Search</span><kbd>Ctrl K</kbd></button>
    <a class="bar-link" href="https://robtic.org" rel="noopener">robtic.org ${icon('external', 13)}</a>
</header>
${body}
<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search the docs" hidden>
    <div class="search-box">
        <label class="search-input">${icon('search', 18)}<input id="search-q" type="search" placeholder="Search the docs" autocomplete="off" spellcheck="false" aria-label="Search"></label>
        <div class="search-results" id="search-results" role="listbox"></div>
        <div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>
    </div>
</div>
<script src="/assets/docs.js" defer></script>
</body>
</html>
`;
}

export function docPage(meta: PageMeta, html: string, headings: Heading[], titles: Map<string, string>, prev: PageMeta | null, next: PageMeta | null): string {
    const product = productOf(meta.path);
    const group = product?.groups.find((g) => g.pages.includes(meta.path));
    const toc = headings.filter((h) => h.level <= 3);
    const body = `
<div class="layout">
    ${sidebar(product, meta.path, titles)}
    <main class="doc" id="main">
        <article>
            <div class="crumbs">${product ? `<a href="/${product.key}">${esc(product.title)}</a>` : ''}${group ? `<span>${icon('right', 12)}</span><span>${esc(group.title)}</span>` : ''}</div>
            <h1>${esc(meta.title)}</h1>
            ${meta.description ? `<p class="lead">${esc(meta.description)}</p>` : ''}
            ${html}
        </article>
        <nav class="pager" aria-label="More pages">
            ${prev ? `<a class="prev" href="${prev.url}"><span>${icon('left', 14)} Previous</span><b>${esc(prev.title)}</b></a>` : '<span></span>'}
            ${next ? `<a class="next" href="${next.url}"><span>Next ${icon('right', 14)}</span><b>${esc(next.title)}</b></a>` : '<span></span>'}
        </nav>
    </main>
    ${toc.length >= 2 ? `<aside class="toc" aria-label="On this page"><div class="toc-h">On this page</div>${toc.map((h) => `<a class="toc-l${h.level === 3 ? ' sub' : ''}" href="#${h.id}">${esc(h.text)}</a>`).join('')}</aside>` : '<aside class="toc"></aside>'}
</div>`;
    return shell(meta, body, { product });
}

export function homePage(meta: PageMeta, html: string, titles: Map<string, string>): string {
    const cards = PRODUCTS.map((p) => `
        <a class="product" href="/${p.key}">
            <span class="product-ico">${icon(p.icon, 22)}</span>
            <b>${esc(p.title)}</b>
            <span>${esc(p.blurb)}</span>
            <span class="product-pages">${p.groups.flatMap((g) => g.pages).slice(1, 5).map((x) => esc(titles.get(x) ?? x)).join(' · ')}</span>
        </a>`).join('');
    const body = `
<main class="home" id="main">
    <section class="hero">
        <h1>How can we help?</h1>
        <p>Guides for everything on Robtic — set up the Discord bots, host your apps, manage your account.</p>
        <button class="hero-search" id="hero-search">${icon('search', 18)}<span>Search the docs</span><kbd>Ctrl K</kbd></button>
    </section>
    <section class="products-grid" aria-label="Products">${cards}</section>
    <section class="home-body">${html}</section>
</main>`;
    return shell(meta, body, { product: null, bodyClass: 'is-home' });
}
