---
title: The basics
description: How a plugin file is laid out, the header, and the values and types the language works with.
---

## How a file is laid out

A plugin reads top to bottom: a **header**, its **settings**, what it **stores**, its **rules**, and its **tests**.

- **Comments** start with `#` and run to the end of the line. `#` followed by 3 or 6 hex digits is a colour
  (`#f97316`), not a comment.
- **Help text** starts with `##` on the line(s) just above a setting.
- **One statement per line.** A short list of actions can share a line with commas: `then delete, warn "No links"`.
- **Indentation makes blocks**, like Python: what's under `then`, under an `if` or inside a `test` is indented the
  same amount (2 spaces). Tabs aren't allowed.
- Inside brackets `( )`, `[ ]` and `{ }` lines can break freely.
- **Names** (`claim_every`, `last_text`) are lowercase letters, digits and `_`, starting with a letter.
- **Keywords are English.** Text members see can be in any language.

## The header

```rrl
plugin "Streaks" for system
version 1
icon "flame"
description en "Daily message streaks." ar "سلاسل الرسائل اليومية."
```

| Line | Required | Meaning |
|---|---|---|
| `plugin "<name>" for <bot>` | yes, first | The name, and the bot it runs with: `system`, `ticket`, `staff`, `guard`, `voice` |
| `version <n>` | yes | A whole number from 1, raised with each published change |
| `icon "<name>"` | no | An icon from the dashboard's set (`flame`, `rocket`, `users`…) |
| `description <text>` | no | Shown in the plugin library; can be in two languages |

There's no author line: the author is the account that publishes it.

## Values and types

Every value has a type, and mixing them up is an error you see while typing ("`claim_every` is a duration; it can't be
compared with a number").

| Type | Write it as | Notes |
|---|---|---|
| `number` | `5`, `2.5`, `-3` | |
| `percent` | `70%` | |
| `duration` | `10s` `5m` `1h` `2d` `1w` | `2.5h` works too |
| `time` | `now`, `member.last_at` | a moment |
| `date` | `today`, `yesterday` | a whole day (UTC) |
| `text` | `"hello"`, `en "Hi" ar "أهلًا"` | `{…}` inside puts values in |
| `bool` | `on` `off` `yes` `no` `true` `false` | all the same two values |
| `color` | `#f97316`, `#fff` | |
| `emoji` | `:fire:` | or the emoji itself inside text |
| `role`, `channel`, `member` | from settings, options and events | never written by name |
| `list of X` | `[1, 7, 30]`, `input.channels` | |
| `table` | a setting with columns | see [Settings](/rules/inputs#tables) |

### Arithmetic

Only arithmetic that makes sense works; the rest is an error.

| Expression | Result |
|---|---|
| `number + number`, `-`, `*`, `/` | number |
| `time + duration`, `time - duration` | time |
| `time - time` | duration |
| `date + duration`, `date - duration` | date |
| `date - date` | duration (whole days) |
| `duration + duration`, `duration - duration` | duration |
| `duration * number`, `duration / number` | duration |
| `text + anything` | text |

```rrl
if now - member.last_at < 10s
then reply "Slow down a little."
```
