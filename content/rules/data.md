---
title: Stored data, timers and schedules
description: What a plugin remembers per member, per server and per row; fixed lists; named checks; timers and schedules.
---

## Storage

What the plugin remembers is declared up front, so the settings page, the limits and the permission list all see it.

```rrl
store member.streak: number = 0
store member.claimed: date
store server.total_boosts: number = 0
store row.post: text
```

| Declaration | Keeps |
|---|---|
| `store member.<name>` | one value per member |
| `store server.<name>` | one value for the server |
| `store row.<name>` | one value per row of a table setting (in row events, and in the buttons they posted) |

Types: `number`, `text`, `bool`, `duration`, `time`, `date`.

- Read it like any field: `member.streak`, `option.user.streak`, `server.total_boosts`.
- Change it with `set`, reset it with `clear`.
- A value never set reads as its default, or **empty** without one.
- Limits: 20 store keys, 1 KB per member, 64 KB for the server. Removing the plugin keeps the data for 30 days.

## Lists

Fixed lists written into the plugin (settings are for lists the server edits):

```rrl
list trusted = ["youtube.com", "github.com"]

rule "Trusted links"
when message
if message.links any in list.trusted
then react :white_check_mark:
```

Up to 10 lists, 5000 entries in all.

## Checks

Write a condition once and use it by name in any rule:

```rrl
check is_staff = member.is_admin or member.has_role(input.staff_role)
check fresh_text = not (lower(message.content) = lower(member.last_text) and now - member.last_at < 10s)
```

A check is a name for a yes/no expression: it takes no arguments and can't call itself. A check that reads `message`
can only be used in message rules.

## Timers and schedules

**Timers belong to one member.** Starting a running timer restarts it, so "each claim pushes the deadline back" is one
line:

```rrl
rule "Claim"
when message in input.channels
then
  set member.streak = member.streak + 1
  start timer "lost" after 2d

rule "Lost the streak"
when timer "lost"
then
  set member.streak = 0
  dm member "Your streak ended. Start again today!"
```

- Up to 30 days, 1000 waiting per plugin.
- **Server timers**: `start timer "thank" after 30m for server` is one timer for the whole server; its rule has no
  `member`. Boosts uses this to thank a burst of boosts once: each boost restarts it, and the thank-you goes out when
  the boosts stop.
- **Schedules** run on the clock: `when schedule every 1d at "00:00"`. One per plugin, at most every 10 minutes.

> **Tip** Prefer timers to schedules: they cost nothing until they fire and never need to go through every member.
