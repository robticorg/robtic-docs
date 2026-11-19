// Robtic Docs: search (Ctrl K or /), mobile menu, copy buttons on code, screenshot zoom, the active "On this page" link.
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------------- mobile menu */
    const menuBtn = $('#menu-btn');
    menuBtn?.addEventListener('click', () => {
        const open = document.body.classList.toggle('menu-open');
        menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('menu-open') && !e.target.closest('.side') && !e.target.closest('#menu-btn')) {
            document.body.classList.remove('menu-open');
            menuBtn?.setAttribute('aria-expanded', 'false');
        }
    });
    $('.side-link.on')?.scrollIntoView({ block: 'center' });

    /* ---------------- copy buttons */
    for (const pre of $$('.doc pre')) {
        const b = document.createElement('button');
        b.className = 'copy';
        b.type = 'button';
        b.textContent = 'Copy';
        b.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText); b.textContent = 'Copied'; }
            catch { b.textContent = 'Press Ctrl C'; }
            setTimeout(() => (b.textContent = 'Copy'), 1500);
        });
        pre.appendChild(b);
    }

    /* ---------------- screenshot zoom */
    for (const img of $$('.shot img')) {
        img.addEventListener('click', () => {
            const z = document.createElement('div');
            z.className = 'zoom';
            z.setAttribute('role', 'dialog');
            z.setAttribute('aria-label', img.alt);
            z.innerHTML = `<img src="${img.src}" alt="">`;
            const close = () => { z.remove(); document.removeEventListener('keydown', esc); };
            const esc = (e) => { if (e.key === 'Escape') close(); };
            z.addEventListener('click', close);
            document.addEventListener('keydown', esc);
            document.body.appendChild(z);
        });
    }

    /* ---------------- On this page: the heading in view */
    const tocLinks = $$('.toc-l');
    if (tocLinks.length) {
        const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
        const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (!e.isIntersecting) continue;
                tocLinks.forEach((a) => a.classList.remove('on'));
                byId.get(e.target.id)?.classList.add('on');
            }
        }, { rootMargin: '-80px 0px -70% 0px' });
        heads.forEach((h) => io.observe(h));
    }

    /* ---------------- search */
    const dialog = $('#search');
    const input = $('#search-q');
    const results = $('#search-results');
    let index = null;
    let items = [];
    let active = 0;
    let lastFocus = null;

    const load = () => index ?? fetch('/search.json').then((r) => r.json()).then((d) => (index = d));
    const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const mark = (text, words) => {
        let out = escHtml(text);
        for (const w of words) if (w) out = out.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
        return out;
    };

    function score(doc, words) {
        let s = 0;
        const t = doc.t.toLowerCase(), h = doc.h.join(' ').toLowerCase(), x = doc.x.toLowerCase();
        for (const w of words) {
            if (t.includes(w)) s += t.startsWith(w) ? 12 : 8;
            else if (h.includes(w)) s += 4;
            else if (x.includes(w)) s += 1;
            else return 0;
        }
        return s;
    }

    function snippet(doc, words) {
        const head = doc.h.find((h) => words.some((w) => h.toLowerCase().includes(w)));
        if (head) return head;
        const x = doc.x, i = Math.max(0, x.toLowerCase().indexOf(words[0] ?? ''));
        return (i > 40 ? '…' : '') + x.slice(Math.max(0, i - 40), i + 90);
    }

    async function run() {
        const q = input.value.trim().toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);
        const data = await load();
        items = (words.length ? data.map((d) => ({ d, s: score(d, words) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 12).map((r) => r.d) : data.slice(0, 8));
        active = 0;
        results.innerHTML = items.length
            ? items.map((d, i) => `<a class="search-item${i === 0 ? ' on' : ''}" role="option" href="${d.u}"><b>${mark(d.t, words)}</b><span>${escHtml(d.s)} · ${mark(words.length ? snippet(d, words) : d.x.slice(0, 100), words)}</span></a>`).join('')
            : `<div class="search-empty">No results for “${escHtml(input.value)}”.</div>`;
    }

    function open() {
        lastFocus = document.activeElement;
        dialog.hidden = false;
        input.value = '';
        input.focus();
        void run();
    }
    function close() {
        dialog.hidden = true;
        lastFocus?.focus?.();
    }
    function move(d) {
        const links = $$('.search-item', results);
        if (!links.length) return;
        links[active]?.classList.remove('on');
        active = (active + d + links.length) % links.length;
        links[active].classList.add('on');
        links[active].scrollIntoView({ block: 'nearest' });
    }

    $('#search-btn')?.addEventListener('click', open);
    $('#hero-search')?.addEventListener('click', open);
    input?.addEventListener('input', () => void run());
    dialog?.addEventListener('click', (e) => { if (e.target === dialog) close(); });
    document.addEventListener('keydown', (e) => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
        if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing && dialog.hidden)) { e.preventDefault(); open(); return; }
        if (dialog.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') { const a = $$('.search-item', results)[active]; if (a) { e.preventDefault(); location.href = a.href; } }
    });
})();
