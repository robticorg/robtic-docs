---
title: Rules and events
description: A rule is when, if and then. Every event a rule can react to, conditions, and what you can write under then.
---

```rrl
rule "Claim the daily streak"
when message in input.channels
if  not member.is_bot
and message.length >= input.min_length
then
  set member.streak = member.streak + 1
  react :fire:
```

A rule has a **name** (shown in the run log), **when** it runs, an optional **if**, and **then** what it does. `when`,
`if`, `and`/`or` and `then` line up with `rule`; the actions under `then` are indented. A short rule can keep its
actions on the `then` line: `then delete, warn "No links"`.

Several rules can react to the same event. They run **in file order**, each one seeing what the ones before changed.

## Events (`when`)

| Event | Happens when | You can use |
|---|---|---|
| `message` | a member sends a message | `message` `member` `channel` `here` |
| `message_edit` | a message is edited | same |
| `member_join` / `member_leave` | someone joins / leaves (or is kicked) | `member` |
| `member_update` | a member's roles, name or timeout change | `member` (with `was_timed_out`, `tag_before`) |
| `boost` / `boost_end` | someone starts / stops boosting | `member` |
| `tag_change` | someone puts on or takes off a server tag | `member` (`tag`, `tag_before`) |
| `reaction_add` / `reaction_remove` | a reaction is added / removed | `member` `message` `channel` `here` `emoji` |
| `voice_join` / `voice_leave` | someone joins / leaves a voice channel | `member` `channel` (`minutes` on leave) |
| `command "<name>"` | someone uses the plugin's command | `member` `channel` `here` `option` |
| `button "<id>"` / `select "<id>"` | someone clicks the plugin's button / picks in its menu | `member` `channel` `here` `message` `value` |
| `form "<id>"` | someone sends the plugin's form | `member` `channel` `here` `answer` |
| `timer "<name>"` | a timer this plugin started runs out | `member` (whose timer it was) |
| `schedule every <duration> [at "HH:MM"]` | on a clock (UTC) | — |
| `row_added "<table>"` / `row_edited` / `row_removed` | the server changed a row of a table setting | `row` |

`server`, `input`, `list`, `now`, `today`, `yesterday` and your [checks](/rules/data#checks) are always there.

**Only some channels:** put `in` after the event. `when message in input.channels`, `when voice_join in
input.voice_channels`: the rule only runs there.

## Conditions (`if`)

`if` takes one yes/no expression. Long conditions continue on lines starting with `and` or `or`:

```rrl
rule "Fake nitro links"
when message
if  member.joined < 1d
and message.matches("(?i)free.{0,12}nitro")
and message.link_count > 0
then delete, warn "Scam links aren't allowed."
```

> **Important** `and` and `or` can't be mixed without brackets. `a and b or c` is an error; write `(a and b) or c` or
> `a and (b or c)`. Every rule stays unambiguous, and the Blocks editor can always draw it.

## Under `then`

| Statement | Example | Meaning |
|---|---|---|
| an action | `reply "Done"` | do something; see [Actions](/rules/actions) |
| `let` | `let target = option.user or member` | name a value for the rest of this rule |
| `set` | `set member.streak = member.streak + 1` | change [stored data](/rules/data) |
| `clear` | `clear member.streak` · `clear member` | back to the default / forget that member |
| `if` | below | do something only sometimes |

```rrl
if not is_staff
  reply "You can't give streaks back." private
else if option.user.lost = 0
  reply "Nothing to give back." private
else
  set option.user.streak = option.user.lost
  reply "Done!"
```

- Short form on one line: `if input.reminders then start timer "remind" after 1d`.
- `else` lines up with its `if`. Ifs can be nested **3 deep**.
- If any part of a rule fails (it ran out of its work budget, it divided by zero), **nothing** from that rule happens
  and the run log says why. The rules after it still run.
