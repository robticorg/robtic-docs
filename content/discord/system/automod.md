---
title: AutoMod
description: Stop bad words, spam, scams and raids with ready templates — or rules you build yourself.
---

AutoMod watches messages, edits and member names and acts the moment something breaks your rules. It runs on the
**Robtic Engine**, a separate service, so protection keeps working even while the bot restarts.

![AutoMod](/shots/system/automod.webp "Robtic System → AutoMod: installed templates and server settings")

## Turn it on

1. Open **Robtic System → AutoMod** and turn the switch on (it's off until you do).
2. Open the **Library** and press **Install** on the templates you want.
3. Pick a **log channel** under Settings so you can see what AutoMod catches.
4. **Save changes**.

![The template library](/shots/system/automod-library.webp "Library: Official templates by Robtic, Community templates, and your own (Mine)")

## Templates

| Template | Stops |
|---|---|
| **Bad words** | Insults and swearing in Arabic and English — also disguised: `f.u.c.k`, `fuuuck`, `@` for a. |
| **Discord invites** | Invites to other servers (your own are allowed). |
| **Links** | Any link, except the sites you allow. |
| **Scam & phishing links** | Fake Nitro and Steam sites, crypto giveaway scams. |
| **Mention spam** | Too many mentions in one message. |
| **Message flood** | Many messages in a few seconds, or the same message again. |
| **Caps & emoji spam** | Shouting in capitals, walls of emojis. |
| **Bad names & profiles** | Offensive usernames and nicknames, on join and when changed. |
| **Discord spam filter / word presets** | Discord's own spam detection and word lists (created as Discord AutoMod rules). |

Each installed template has its own **actions**: remove the message, alert the log channel, and a punishment — warn,
mute, timeout or jail — with a reason. Warns, mutes and jails are recorded as normal [moderation](/discord/system/moderation) cases.

## Server settings

- **Ignored roles and channels** — AutoMod never acts there.
- **Never block** — words that are always allowed on your server (fix a false positive without editing a template).
- **Images only / YouTube links only** channels.

## Make your own template

Press **New template** in **Library → Mine**. A short wizard walks you through **Basics → Words → Checks → Actions**.
Words support Discord's wildcards: `word` (whole word), `word*` (starts with), `*word*` (anywhere). **Switch to
advanced mode** for regex and *Robtic Rules* — plain-English rules with strikes and escalation.

**Share a template:** open it and press **Copy link**. Anyone who manages a server can open the link and install it.
Community templates are reviewed by Robtic before they appear in the public library.
