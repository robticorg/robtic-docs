---
title: Publishing, versions and permissions
description: Raise the version, migrate stored data, see the permissions a plugin asks for, and the errors the checker shows.
---

## Versions

Each published change raises `version`. Servers that installed the plugin get the new version; one that asks for **more
permissions** waits until the server approves the update.

## Migrations

If a new version changes what's stored, a `migrate` block converts the old data once per member and once for the
server, the first time the new version runs:

```rrl
version 2

store member.best: number = 0

migrate from 1
  set member.best = max(member.best, member.streak)
```

## Permissions

A plugin never writes its permissions: the checker works them out from the code, and the server sees the list before
installing.

| If the plugin… | It asks to… |
|---|---|
| has a `message` / `message_edit` rule | Read messages (in the channels you pick, if filtered) |
| has `store member.` / `store server.` | Store data for each member / for the server |
| declares commands | Add the commands /a, /b |
| uses `reply` / `send` / `react` | Send messages / react |
| uses `dm` | Send direct messages |
| uses `give role` / `take role` / `tier roles` | Give and take the roles you choose |
| uses `give points` | Give Points |
| has a `schedule` | Run on a schedule |
| uses moderation actions | Moderate members (delete, warn, mute…) |

On your computer: `rrl permissions streaks.rrl`.

## Errors and warnings

The editor checks as you type, exactly as the engine would. Every message points at a line and column and says what to
do:

```
streaks.rrl:24:5  error    `claim_every` is a duration; it can't be compared with a number.
streaks.rrl:31:3  error    `and` and `or` are mixed here. Add brackets to show which goes first.
streaks.rrl:40:9  error    `message` isn't available in a `timer` rule.
streaks.rrl:12:7  warning  The input `points` is never used.
streaks.rrl:55:3  warning  The timer "remind" is handled but never started.
```

Errors must be fixed before the plugin can run; warnings point at things that are probably mistakes.

## The `rrl` tool

| Command | Does |
|---|---|
| `rrl check <file>` | errors and warnings |
| `rrl test <file>` | runs the tests |
| `rrl permissions <file>` | the permission list |
| `rrl ast <file>` | the parsed plugin as JSON |
