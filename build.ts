// Builds docs.robtic.org: content/**/*.md → dist/**/index.html, plus search index, sitemap, robots and 404.
//   bun build.ts           build once
//   bun build.ts --check   build and fail on a missing page, image or broken internal link
//   bun build.ts --watch   rebuild on change and serve on http://localhost:4321

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, watch, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { Marked, type Tokens } from 'marked';
import { PRODUCTS } from './src/nav.ts';
import { docPage, homePage, ORIGIN, urlOf, type Heading, type PageMeta } from './src/layout.ts';
import { discordPreview, highlightRrl, pluginName, settingsPreview } from './src/rrl.ts';

const ROOT = import.meta.dir;
const CONTENT = join(ROOT, 'content');
const PUBLIC = join(ROOT, 'public');
const DIST = join(ROOT, 'dist');
const args = new Set(process.argv.slice(2));

interface Page extends PageMeta { body: string }

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : f.endsWith('.md') ? [p] : [];
    });
}

function frontmatter(src: string): { data: Record<string, string>; body: string } {
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
    if (!m) return { data: {}, body: src };
    const data: Record<string, string> = {};
    for (const line of m[1]!.split(/\r?\n/)) {
        const i = line.indexOf(':');
        if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
    return { data, body: src.slice(m[0].length) };
}

const slug = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const plain = (md: string) => md.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*_`|-]/g, ' ').replace(/\s+/g, ' ').trim();

function load(): Page[] {
    return walk(CONTENT).map((file) => {
        const path = relative(CONTENT, file).replace(/\\/g, '/').replace(/\.md$/, '');
        const { data, body } = frontmatter(readFileSync(file, 'utf8'));
        if (!data.title) throw new Error(`${path}.md: missing "title" in the front matter`);
        return { path, url: urlOf(path), title: data.title, description: data.description ?? '', body };
    });
}

/** Markdown → HTML, collecting headings. Callouts: a blockquote starting with **Note**, **Tip** or **Warning**. */
function render(page: Page, problems: string[], known: Set<string>): { html: string; headings: Heading[] } {
    const headings: Heading[] = [];
    const used = new Map<string, number>();
    const md = new Marked({ gfm: true });
    md.use({
        renderer: {
            heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, t: Tokens.Heading) {
                const text = this.parser.parseInline(t.tokens);
                let id = slug(t.text);
                const n = used.get(id) ?? 0;
                used.set(id, n + 1);
                if (n) id = `${id}-${n}`;
                if (t.depth >= 2) headings.push({ level: t.depth, id, text: t.text.replace(/[`*_]/g, '') });
                return `<h${t.depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h${t.depth}>\n`;
            },
            image(t: Tokens.Image) {
                if (t.href.startsWith('/') && !existsSync(join(PUBLIC, t.href))) problems.push(`${page.path}: missing image ${t.href}`);
                const caption = t.title || t.text;
                return `<figure class="shot"><img src="${t.href}" alt="${t.text.replace(/"/g, '&quot;')}" loading="lazy" decoding="async">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
            },
            link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, t: Tokens.Link) {
                let href = t.href;
                const text = this.parser.parseInline(t.tokens);
                if (href.startsWith('/') && !href.startsWith('//')) {
                    const [p, hash] = href.split('#');
                    const key = p === '/' ? 'index' : p!.replace(/^\//, '').replace(/\/$/, '');
                    if (!known.has(key) && !known.has(`${key}/index`) && !existsSync(join(PUBLIC, p!))) problems.push(`${page.path}: broken link ${href}`);
                    href = (p === '/' ? '/' : `/${key}`) + (hash ? `#${hash}` : '');
                }
                const ext = /^https?:\/\//.test(href) && !href.startsWith(ORIGIN);
                return `<a href="${href}"${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
            },
            blockquote(this: { parser: { parse: (t: Tokens.Generic[]) => string } }, t: Tokens.Blockquote) {
                const inner = this.parser.parse(t.tokens);
                const m = /^<p><strong>(Note|Tip|Warning|Important)<\/strong>:?\s*/i.exec(inner);
                if (!m) return `<blockquote>${inner}</blockquote>`;
                const kind = m[1]!.toLowerCase();
                return `<div class="callout ${kind}"><div class="callout-h">${m[1]}</div>${inner.replace(m[0], '<p>')}</div>`;
            },
            // ```rrl is highlighted; ```rrl settings adds the settings page its inputs draw; ```discord draws a message.
            code(t: Tokens.Code) {
                const [lang, extra] = (t.lang ?? '').split(/\s+/);
                const plain = t.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                if (lang === 'discord') return discordPreview(t.text);
                if (lang !== 'rrl') return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${plain}</code></pre>\n`;
                const pre = `<pre class="rrl"><code>${highlightRrl(t.text)}</code></pre>`;
                const preview = extra === 'settings' ? settingsPreview(t.text, pluginName(t.text)) : '';
                if (extra === 'settings' && !preview) problems.push(`${page.path}: an rrl settings block has no inputs`);
                if (!preview) return `${pre}\n`;
                return `<div class="tabs"><div class="tabs-bar" role="tablist"><button role="tab" aria-selected="true" class="on">Code</button><button role="tab" aria-selected="false">Settings page</button></div><div class="tab-panel">${pre}</div><div class="tab-panel" hidden>${preview}</div></div>\n`;
            },
            table(this: unknown, t: Tokens.Table) {
                const cell = (c: Tokens.TableCell) => (c as unknown as { text: string }).text;
                const inl = (s: string) => md.parseInline(s) as string;
                const head = `<tr>${t.header.map((c) => `<th>${inl(cell(c))}</th>`).join('')}</tr>`;
                const rows = t.rows.map((r) => `<tr>${r.map((c) => `<td>${inl(cell(c))}</td>`).join('')}</tr>`).join('');
                return `<div class="table"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
            },
        },
    });
    const html = md.parse(page.body) as string;
    return { html, headings };
}

function build(): string[] {
    const problems: string[] = [];
    const pages = load();
    const byPath = new Map(pages.map((p) => [p.path, p]));
    const known = new Set(pages.map((p) => p.path));
    const titles = new Map(pages.map((p) => [p.path, p.title]));

    // Every page in the sidebar exists, and every page is in the sidebar (except the home page).
    const order = PRODUCTS.flatMap((pr) => pr.groups.flatMap((g) => g.pages));
    for (const p of order) if (!byPath.has(p)) problems.push(`nav: no page content/${p}.md`);
    for (const p of pages) if (p.path !== 'index' && !order.includes(p.path)) problems.push(`content/${p.path}.md isn't in src/nav.ts`);

    rmSync(DIST, { recursive: true, force: true });
    mkdirSync(DIST, { recursive: true });
    cpSync(PUBLIC, DIST, { recursive: true });

    const index: Array<{ t: string; u: string; s: string; h: string[]; x: string }> = [];
    for (const page of pages) {
        const { html, headings } = render(page, problems, known);
        const i = order.indexOf(page.path);
        const prevPath = i > 0 ? order[i - 1] : undefined;
        const nextPath = i >= 0 && i < order.length - 1 ? order[i + 1] : undefined;
        // The pager stays inside one product.
        const sameProduct = (p?: string) => (p && p.split('/')[0] === page.path.split('/')[0] ? byPath.get(p) ?? null : null);
        const out = page.path === 'index' ? homePage(page, html, titles) : docPage(page, html, headings, titles, sameProduct(prevPath), sameProduct(nextPath));
        const file = page.path === 'index' ? join(DIST, 'index.html') : join(DIST, page.path.replace(/\/index$/, ''), 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, out);
        const product = PRODUCTS.find((pr) => page.path.startsWith(`${pr.key}/`));
        if (page.path !== 'index') index.push({ t: page.title, u: page.url, s: product?.title ?? '', h: headings.map((h) => h.text), x: `${page.description} ${plain(page.body)}`.slice(0, 600) });
    }

    writeFileSync(join(DIST, 'search.json'), JSON.stringify(index));
    writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${ORIGIN}${p.url}</loc></url>`).join('\n')}\n</urlset>\n`);
    writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);
    const notFound: Page = { path: '404', url: '/404', title: 'Page not found', description: 'This page doesn’t exist (any more). Search the docs, or start from a product below.', body: '' };
    writeFileSync(join(DIST, '404.html'), docPage(notFound, '<p><a href="/">Back to the docs home</a></p>', [], titles, null, null));
    return problems;
}

const problems = build();
const pageCount = load().length;
if (problems.length) {
    console.warn(`${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
    if (args.has('--check')) process.exit(1);
}
console.log(`built ${pageCount} pages → dist/`);

if (args.has('--watch')) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    for (const dir of [CONTENT, PUBLIC, join(ROOT, 'src')]) {
        watch(dir, { recursive: true }, () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => { try { const p = build(); console.log(`rebuilt${p.length ? ` (${p.length} problems)` : ''}`); } catch (e) { console.error(e); } }, 120);
        });
    }
    Bun.serve({
        port: 4321,
        fetch(req) {
            const path = decodeURIComponent(new URL(req.url).pathname);
            for (const f of [join(DIST, path), join(DIST, path, 'index.html')]) {
                if (existsSync(f) && statSync(f).isFile()) return new Response(Bun.file(f));
            }
            return new Response(Bun.file(join(DIST, '404.html')), { status: 404 });
        },
    });
    console.log('serving http://localhost:4321');
}
