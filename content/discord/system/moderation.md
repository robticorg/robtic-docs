---
title: Moderation
description: Warn, mute and jail with reasons, proof and punishment levels.
---

Robtic System's moderation keeps a **case** for every punishment, adds to the member's **punishment level** (0–100)
and can ask for **proof** before a punishment is applied.

![Moderation](/shots/system/moderation.webp "Robtic System → Moderation: reasons per punishment, proof and moderator points")

## Reasons

Reasons are presets moderators pick from — one board per punishment (**Warn**, **Mute**, **Jail**).

1. Press **+** on a board, write the reason in English and Arabic, and give it a short key.
2. Delete a reason with its bin icon.
3. **Save changes**.

> **Note** Once you save your reasons here, the bot uses exactly this list on your server — reasons you delete stay deleted.

## Proof and shortcuts

- **Proof channel**: where moderators post evidence for a punishment.
- **Shortcut roles**: roles allowed to use the quick punish shortcuts.
- **Points per action**: staff points a moderator earns per punishment (with [Robtic Staff](/discord/staff/points)).

## Commands

| Command | |
|---|---|
| `/warn add · appeal · list` | Warnings |
| `/mute add · remove · appeal · list` | Mutes (Discord timeout + case) |
| `/jail add · remove · appeal · list` | Jail |
| `/ban` · `/kick` · `/unban` | Plain Discord actions |
| `/chat lock · unlock · slowmode · clear` | Channel controls |

`remove` lifts a punishment but keeps the level; `appeal` also clears the level points.
