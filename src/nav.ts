// The sidebar: products → groups → pages (paths relative to content/, without .md). Order here is the order shown.
// Every page in content/ must appear here once (the build checks).

export interface NavGroup { title: string; pages: string[] }
export interface Product { key: string; title: string; blurb: string; icon: string; groups: NavGroup[] }

export const PRODUCTS: Product[] = [
    {
        key: 'discord',
        title: 'Discord',
        blurb: 'Robtic’s Discord bots and the dashboard that sets them up.',
        icon: 'discord',
        groups: [
            { title: 'Start here', pages: ['discord/index', 'discord/dashboard', 'discord/access'] },
            {
                title: 'Robtic System',
                pages: [
                    'discord/system/index', 'discord/system/general', 'discord/system/levels', 'discord/system/points', 'discord/system/streaks',
                    'discord/system/leaderboards', 'discord/system/moderation', 'discord/system/automod', 'discord/system/rules', 'discord/system/autoreply',
                    'discord/system/panels', 'discord/system/logs', 'discord/system/community', 'discord/system/commands',
                ],
            },
            { title: 'Robtic Staff', pages: ['discord/staff/index', 'discord/staff/setup', 'discord/staff/points'] },
            { title: 'Robtic Ticket', pages: ['discord/ticket/index', 'discord/ticket/panels', 'discord/ticket/transcripts', 'discord/ticket/lifecycle', 'discord/ticket/commands'] },
            { title: 'More bots', pages: ['discord/guard', 'discord/voice'] },
        ],
    },
    {
        key: 'hosting',
        title: 'Hosting',
        blurb: 'Host Discord bots, websites and APIs on Robtic.',
        icon: 'server',
        groups: [
            { title: 'Start here', pages: ['hosting/index', 'hosting/first-app'] },
            { title: 'Your apps', pages: ['hosting/workspaces', 'hosting/console', 'hosting/files', 'hosting/databases', 'hosting/backups', 'hosting/domains', 'hosting/github', 'hosting/secrets', 'hosting/alerts'] },
            { title: 'People', pages: ['hosting/teams'] },
        ],
    },
    {
        key: 'rules',
        title: 'Robtic Rules',
        blurb: 'The plain-English language for plugins and AutoMod rules: inputs, rules, messages and tests.',
        icon: 'code',
        groups: [
            { title: 'Start here', pages: ['rules/index', 'rules/first-plugin', 'rules/basics'] },
            { title: 'The language', pages: ['rules/inputs', 'rules/rules', 'rules/actions', 'rules/messages', 'rules/data', 'rules/commands', 'rules/expressions'] },
            { title: 'Ship it', pages: ['rules/tests', 'rules/publishing'] },
            { title: 'Reference', pages: ['rules/reference'] },
        ],
    },
    {
        key: 'account',
        title: 'Account',
        blurb: 'Your Robtic account: sign-in, security and connections.',
        icon: 'user',
        groups: [
            { title: 'Your account', pages: ['account/index', 'account/security', 'account/connections'] },
        ],
    },
];

export const productOf = (path: string) => PRODUCTS.find((p) => path === p.key || path.startsWith(`${p.key}/`)) ?? null;
