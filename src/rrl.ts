// Code blocks with something extra, used by build.ts:
//   ```rrl            Robtic Rules, highlighted
//   ```rrl settings   … plus a "Settings page" tab: the settings the plugin's `input` lines draw on the dashboard
//   ```discord        a Discord message, drawn the way members see it (what a rule sends)
// All of it is plain HTML and CSS (docs.css "RRL" section); the tabs are switched by docs.js.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const KEYWORDS = new Set([
    'plugin', 'for', 'version', 'icon', 'description', 'input', 'required', 'list', 'store', 'check', 'command', 'option', 'form', 'field',
    'rule', 'when', 'if', 'and', 'or', 'not', 'then', 'else', 'let', 'set', 'clear', 'in', 'to', 'from', 'as', 'with', 'at', 'after', 'every',
    'test', 'given', 'expect', 'wait', 'nothing', 'migrate', 'use', 'private', 'contains', 'starts_with', 'ends_with', 'matches', 'any', 'by',
]);
const ACTIONS = new Set([
    'reply', 'send', 'dm', 'react', 'update', 'delete', 'give', 'take', 'tier', 'role', 'roles', 'points', 'start', 'stop', 'timer', 'show',
    'warn', 'mute', 'timeout', 'jail', 'alert', 'strike', 'slowmode', 'lock', 'log', 'embed', 'components', 'button', 'schedule',
]);
const CONSTANTS = new Set(['on', 'off', 'yes', 'no', 'true', 'false', 'now', 'today', 'yesterday', 'here', 'en', 'ar']);
const TYPES = new Set(['text', 'number', 'percent', 'duration', 'time', 'date', 'bool', 'color', 'emoji', 'image', 'role', 'roles', 'channel', 'channels', 'member', 'words', 'table', 'long_text']);

/** One line of RRL as highlighted HTML. Simple on purpose: it colours, it doesn't check. */
function line(src: string): string {
    let out = '';
    let i = 0;
    let afterColon = false;
    while (i < src.length) {
        const rest = src.slice(i);
        let m: RegExpExecArray | null;
        if ((m = /^##.*/.exec(rest))) { out += `<span class="t-doc">${esc(m[0])}</span>`; break; }
        if ((m = /^#[0-9a-fA-F]{6}\b|^#[0-9a-fA-F]{3}\b/.exec(rest))) {
            out += `<span class="t-col"><i style="background:${m[0]}"></i>${esc(m[0])}</span>`;
            i += m[0].length;
            continue;
        }
        if ((m = /^#.*/.exec(rest))) { out += `<span class="t-cmt">${esc(m[0])}</span>`; break; }
        if ((m = /^"(?:[^"\\]|\\.)*"?/.exec(rest))) {
            // Values inside text ({member.mention}) stand out from the words around them.
            const s = esc(m[0]).replace(/\{\{/g, '\u0000').replace(/\{([^}]*)\}/g, '<span class="t-ins">{$1}</span>').replace(/\u0000/g, '{{');
            out += `<span class="t-str">${s}</span>`;
            i += m[0].length;
            continue;
        }
        if ((m = /^:[a-z0-9_+-]+:/.exec(rest))) { out += `<span class="t-emo">${esc(m[0])}</span>`; i += m[0].length; continue; }
        if ((m = /^-?\d+(?:\.\d+)?(?:[smhdw]\b|%)?/.exec(rest))) { out += `<span class="t-num">${m[0]}</span>`; i += m[0].length; continue; }
        if ((m = /^[a-z_][a-z0-9_]*/i.exec(rest))) {
            const w = m[0];
            const next = src[i + w.length];
            const prev = out.endsWith('.') || /\.$/.test(src.slice(0, i));
            let cls = '';
            if (prev) cls = 't-fld';
            else if (next === '(') cls = 't-fn';
            else if (afterColon && TYPES.has(w)) cls = 't-type';
            else if (KEYWORDS.has(w)) cls = 't-kw';
            else if (ACTIONS.has(w)) cls = 't-act';
            else if (CONSTANTS.has(w)) cls = 't-const';
            out += cls ? `<span class="${cls}">${w}</span>` : w;
            if (w !== 'input' && w !== 'store' && w !== 'option' && w !== 'field') afterColon = afterColon && TYPES.has(w);
            i += w.length;
            continue;
        }
        const ch = src[i]!;
        if (ch === ':') afterColon = true;
        out += esc(ch);
        i++;
    }
    return out;
}

export function highlightRrl(code: string): string {
    return code.split('\n').map(line).join('\n');
}

/* ------------------------------------------------------------------ the settings page a plugin's inputs draw */

interface Input { name: string; type: string; label: string; def: string | null; required: boolean; help: string; columns: { name: string; type: string; label: string }[] }

const unq = (s: string) => s.replace(/^"|"$/g, '');
/** A bilingual label (`en "A" ar "B"`) shows its English side. */
const label = (s: string) => unq((/en\s+("[^"]*")/.exec(s)?.[1] ?? /"[^"]*"/.exec(s)?.[0] ?? s).trim());

export function readInputs(code: string): Input[] {
    const out: Input[] = [];
    let help: string[] = [];
    for (const raw of code.split('\n')) {
        const l = raw.trimEnd();
        const doc = /^##\s?(.*)$/.exec(l.trim());
        if (doc && !l.startsWith(' ')) { help.push(doc[1]!); continue; }
        const m = /^input\s+([a-z_][a-z0-9_]*)\s*:\s*([a-z_]+)\s*(?:=\s*(.+?))?\s+((?:en\s+)?"[^"]*"(?:\s+ar\s+"[^"]*")?)\s*(required)?\s*$/.exec(l);
        if (m) {
            out.push({ name: m[1]!, type: m[2]!, def: m[3]?.trim() ?? null, label: label(m[4]!), required: !!m[5], help: help.join(' '), columns: [] });
            help = [];
            continue;
        }
        const col = /^\s+([a-z_][a-z0-9_]*)\s*:\s*([a-z_]+)\s+("[^"]*")/.exec(l);
        if (col && out.length && out[out.length - 1]!.type === 'table' && /^\s/.test(l)) {
            out[out.length - 1]!.columns.push({ name: col[1]!, type: col[2]!, label: unq(col[3]!) });
            continue;
        }
        if (l.trim()) help = [];
    }
    return out;
}

function control(i: Input): string {
    const d = i.def ? unq(i.def) : '';
    switch (i.type) {
        case 'bool': return `<span class="sp-switch${/^(on|yes|true)$/.test(d) ? ' on' : ''}"><i></i></span>`;
        case 'number': case 'percent': case 'duration':
            return `<span class="sp-box sp-num">${esc(d || '—')}</span>`;
        case 'color': return `<span class="sp-box"><i class="sp-dot" style="background:${esc(d || '#5865f2')}"></i>${esc(d || '#5865f2')}</span>`;
        case 'emoji': return `<span class="sp-box sp-num">${esc(d || '🙂')}</span>`;
        case 'image': return '<span class="sp-drop">Upload a picture</span>';
        case 'role': return '<span class="sp-box sp-pick">Choose a role</span>';
        case 'roles': return '<span class="sp-box sp-pick">Choose roles</span>';
        case 'channel': return '<span class="sp-box sp-pick"># Choose a channel</span>';
        case 'channels': return '<span class="sp-box sp-pick"># Choose channels</span>';
        case 'words': return `<span class="sp-box sp-area">${esc(d || 'One per line')}</span>`;
        case 'table': return `<span class="sp-table">${i.columns.map((c) => `<span>${esc(c.label)}</span>`).join('')}</span><span class="sp-add">+ Add</span>`;
        default: return `<span class="sp-box sp-area">${esc(d.replace(/\\n/g, ' ') || '')}</span>`;
    }
}

export function settingsPreview(code: string, title: string): string {
    const inputs = readInputs(code);
    if (!inputs.length) return '';
    const rows = inputs.map((i) => `
        <div class="sp-row${['text', 'words', 'table', 'image'].includes(i.type) ? ' wide' : ''}">
            <div class="sp-label"><b>${esc(i.label)}</b>${i.required ? '<em>Required</em>' : ''}${i.help ? `<small>${esc(i.help)}</small>` : ''}</div>
            <div class="sp-control">${control(i)}</div>
        </div>`).join('');
    return `<div class="sp" aria-label="Settings page preview"><div class="sp-head"><b>${esc(title)}</b><span class="sp-on"><i></i>On</span></div>${rows}</div>`;
}

/** The plugin's name from its header, for the preview's title. */
export const pluginName = (code: string) => /^plugin\s+"([^"]+)"/m.exec(code)?.[1] ?? 'Plugin settings';

/* ------------------------------------------------------------------ a Discord message, as members see it */

// ```discord
// bot: Robtic System            (who sends it; default Robtic System)
// user: Sara                     (or a member sends it: no APP tag)
// command: /streak by Sara       (the "Sara used /streak" line above a command's answer)
// reactions: 🔥 1 | 👍 3           (under the message)
// text: Plain message text      (repeatable)
// embed: #f47fff                (or `components: #5865f2`; starts the card, colour = side bar / accent)
// title: Card title
// body: A line of the card      (repeatable)
// image: wide                   (a picture placeholder)
// footer: Small print
// buttons: Yes:success | No:danger
// private                       (only the person who clicked sees it)
// ```

function md(s: string): string {
    return esc(s)
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<i>$2</i>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/(^|\s)(@[\p{L}\p{N}_ .-]+?)(?=$|[\s,!.?:;])/gu, '$1<span class="dm-mention">$2</span>')
        .replace(/(^|\s)(#[a-z0-9-]+)/g, '$1<span class="dm-mention">$2</span>');
}

export function discordPreview(spec: string): string {
    let bot = 'Robtic System';
    let isUser = false;
    let used = '';
    let reactions: string[] = [];
    const text: string[] = [];
    let card: { kind: 'embed' | 'components'; color: string; title: string; body: string[]; image: boolean; footer: string } | null = null;
    let buttons: { label: string; style: string }[] = [];
    let priv = false;
    for (const raw of spec.split('\n')) {
        const l = raw.trim();
        if (!l) continue;
        if (l === 'private') { priv = true; continue; }
        const m = /^([a-z]+):\s?(.*)$/.exec(l);
        if (!m) { (card ? card.body : text).push(l); continue; }
        const [, k, v] = m as unknown as [string, string, string];
        if (k === 'bot') bot = v;
        else if (k === 'user') { bot = v; isUser = true; }
        else if (k === 'command') used = v;
        else if (k === 'reactions') reactions = v.split('|').map((x) => x.trim()).filter(Boolean);
        else if (k === 'text') text.push(v);
        else if (k === 'embed' || k === 'components') card = { kind: k, color: v || '#5865f2', title: '', body: [], image: false, footer: '' };
        else if (card && k === 'title') card.title = v;
        else if (card && k === 'body') card.body.push(v);
        else if (card && k === 'image') card.image = true;
        else if (card && k === 'footer') card.footer = v;
        else if (k === 'buttons') buttons = v.split('|').map((b) => { const [lb, st] = b.split(':').map((x) => x.trim()); return { label: lb ?? '', style: st || 'secondary' }; });
        else (card ? card.body : text).push(l);
    }
    const btns = buttons.length ? `<div class="dm-btns">${buttons.map((b) => `<span class="dm-btn ${esc(b.style)}">${md(b.label)}</span>`).join('')}</div>` : '';
    const cardHtml = card ? `
        <div class="dm-card ${card.kind}" style="--accent:${esc(card.color)}">
            ${card.title ? `<div class="dm-title">${md(card.title)}</div>` : ''}
            ${card.body.length ? `<div class="dm-body">${card.body.map(md).join('<br>')}</div>` : ''}
            ${card.image ? '<div class="dm-img" aria-hidden="true"></div>' : ''}
            ${card.footer ? `<div class="dm-foot">${md(card.footer)}</div>` : ''}
            ${card.kind === 'components' ? btns : ''}
        </div>` : '';
    return `
<figure class="dm" aria-label="Discord message preview">
    ${used ? `<div class="dm-used">${(() => { const [cmd, by] = used.split(/\s+by\s+/); return `<b>${esc(by ?? 'Sara')}</b> used <span class="dm-cmd">${esc(cmd ?? '')}</span>`; })()}</div>` : ''}
    <div class="dm-msg">
        <span class="dm-ava${isUser ? ' user' : ''}" aria-hidden="true">${esc(bot.charAt(0))}</span>
        <div class="dm-main">
            <div class="dm-who"><b>${esc(bot)}</b>${isUser ? '' : '<span class="dm-app">APP</span>'}<span class="dm-time">Today at 12:00</span></div>
            ${text.length ? `<div class="dm-text">${text.map(md).join('<br>')}</div>` : ''}
            ${cardHtml}
            ${card?.kind === 'components' ? '' : btns}
            ${reactions.length ? `<div class="dm-reacts">${reactions.map((r) => `<span class="dm-react">${esc(r)}</span>`).join('')}</div>` : ''}
            ${priv ? '<div class="dm-priv">👁 Only you can see this</div>' : ''}
        </div>
    </div>
</figure>`;
}
