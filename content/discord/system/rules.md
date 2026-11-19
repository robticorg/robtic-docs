---
title: Robtic Rules language
description: Write your own AutoMod rules in plain English: conditions, actions, strikes and escalation.
---

Robtic Rules is the language behind AutoMod's **advanced mode**. A rule reads like a sentence: *when* something happens,
*if* these conditions are true, *then* do these things. Rules run on the Robtic Engine and are checked as you type.

Open it from **Robtic System → AutoMod → Library → Mine → New template**, then **Switch to advanced mode** on the Words
step. You can switch between **Blocks** (a visual builder) and **Code** — both edit the same rules.

## A first rule

```
rule "No shouting"
when message
if message.length >= 10
and message.caps_ratio > 70%
then
  delete
  warn "Please don't write in capitals"
```

Every rule has four parts:

| Part | Meaning |
|---|---|
| `rule "Name"` | The name shown in the log channel. |
| `when <event>` | What triggers it: `message`, `message_edit`, `member_join` or `member_update`. |
| `if … and … / or …` | The conditions. Join them all with `and` (every one must be true) **or** all with `or` (any one is enough) — not a mix. |
| `then` | The actions, one per line (up to 5). |

Lines starting with `#` are comments.

## Conditions

A condition is a **field**, an **operator** and a **value**: `message.length >= 10`. Put `not` in front to reverse
it: `not member.has_role("Staff")`. Yes/no fields need no operator: `message.has_image`.

### Message fields (for `message` and `message_edit`)

| Field | Type | |
|---|---|---|
| `message.content` | text | The whole message |
| `message.length` | number | Characters |
| `message.words` · `message.lines` | number | Words, lines |
| `message.caps_ratio` | percent | Share of letters in capitals |
| `message.emoji_count` | number | Emojis |
| `message.mention_count` | number | Members and roles mentioned |
| `message.link_count` · `message.invites` | number | Links, Discord invites |
| `message.attachments` | number | Files attached |
| `message.has_image` · `message.is_reply` | yes/no | An image is attached · it's a reply |
| `message.matches("regex")` | yes/no | The text matches a regex (Rust / RE2 syntax) |
| `message.any_word(list("name"))` | yes/no | Contains a word from one of your lists |
| `member.messages(5s)` | number | Messages this member sent in the last 5 seconds |
| `member.same_message(1m)` | number | Times they sent this same text recently |
| `channel.in("#general")` | yes/no | The message is in this channel |
| `channel.messages(10s)` | number | Messages in the channel recently |

### Member and server fields (every event)

| Field | Type | |
|---|---|---|
| `member.account_age` | duration | Since their Discord account was made |
| `member.joined` | duration | Since they joined the server |
| `member.level` · `member.warnings` | number | Robtic System level · active warnings |
| `member.is_booster` | yes/no | Boosts the server |
| `member.has_role("Staff")` | yes/no | Has this role |
| `member.name` | text | Display name |
| `member.strikes("name", 1h)` | number | Strikes with that name in the last hour |
| `server.joins(1m)` | number | Members who joined in the last minute |

### Operators and values

| For | Operators |
|---|---|
| numbers | `>` `>=` `<` `<=` `=` `!=` |
| percent | `>` `>=` `<` `<=` — written `70%` |
| durations | `<` `<=` `>` `>=` — written `30s`, `10m`, `2h`, `3d`, `1w` |
| text | `contains` `starts_with` `ends_with` `=` `!=` — written `"in quotes"` |

## Actions

| Action | Example |
|---|---|
| `delete` | Delete the message |
| `warn "reason"` | A Robtic moderation warning |
| `mute 30m "reason"` | A Robtic moderation mute |
| `timeout 10m "reason"` | A Discord timeout (up to 28 days) |
| `jail "reason"` | Robtic moderation jail |
| `alert "note"` | Post in the AutoMod log channel |
| `reply "text" for 10s` | Reply, and delete the reply after 10 seconds (`for` is optional) |
| `react "👀"` | Add a reaction |
| `strike "name"` | Add a strike (for escalation, below) |
| `slowmode 10s for 5m` | Slowmode the channel for a while |
| `log_only` | Do nothing — only log (to test a rule safely) |

## Strikes and escalation

Strikes are counters you name yourself. Add one with `strike`, then decide on the next step with an `if … then …
else …` line after the actions:

```
rule "Flood"
when message
if member.messages(5s) > 5
and not member.has_role("Staff")
then
  delete
  strike "noise"
  if member.strikes("noise", 1h) >= 3 then mute 30m "Too many warnings" else warn "Slow down"
```

The first two times a member floods, they're warned; the third time within an hour, they're muted. Strikes are kept
for 30 days.

## Inputs: let each server choose

A template can declare **inputs** that every server fills in when it installs it — limits, messages, roles:

```
input caps_limit: percent = 70% "Caps limit"
input warn_text: text = "Please don't shout" "Warning message"
input staff: role = "Staff" "Never for this role"

rule "No shouting"
when message
if message.caps_ratio > input.caps_limit
and not member.has_role(input.staff)
then
  delete
  warn input.warn_text
```

An input is `input <key>: <type> = <default> "<label>"`. Types: `text`, `number`, `percent`, `duration`, `role`,
`channel`, `words`, `bool`. Use it anywhere as `input.<key>`.

## Lists

```
list trusted = ["youtube.com", "tenor.com"]
```

Use a list with `message.any_word(list("trusted"))`. Words are matched after normalization (Arabic letter variants,
spaced-out and repeated letters, symbols used as letters).

## Limits

| | |
|---|---|
| Rules per template | 20 |
| Conditions per rule / actions per rule | 25 / 5 |
| Lists / items per list | 10 / 5,000 |
| Inputs | 15 |
| Longest time window | 30 days |

> **Tip** Start a new rule with `log_only` instead of real actions, watch the log channel for a day, then switch to the real actions.
