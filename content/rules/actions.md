---
title: Actions
description: What a rule can do: reply, send, DM and react; give and take roles; pay Points; start timers; moderate.
---

## Messages

| Action | Example |
|---|---|
| `reply <message> [private] [for <duration>]` | `reply "Saved!" private`: answers in place; `private` = only they see it (commands, buttons, forms); `for 10s` deletes it after |
| `send <message> to <channel>` | `send embed {…} to input.announce or here` |
| `send <message> to <channel> as <stored text>` | the first time it posts and keeps the message; after that it **edits** it (or posts again if it was deleted) |
| `delete <stored text>` | `delete row.post`: deletes a message the plugin kept |
| `dm <member> <message>` | `dm member "Your streak ends soon"`: skipped if their DMs are closed |
| `react <emoji>` | `react :fire:` |
| `update <message>` | in a button or menu rule: replaces the message whose button was used |

How messages look (plain, embed, components) is on [Messages](/rules/messages).

### Buttons

Any message can end with buttons. Clicking one runs `when button "<id>"`.

```rrl
rule "Ask"
when command "vote"
then reply "Keep the event on Friday?" with button "yes" "Yes" success with button "no" "No" danger

rule "Yes"
when button "yes"
then reply "Thanks, counted!" private
```

```discord
text: Keep the event on Friday?
buttons: Yes:success | No:danger
```

Styles: `primary`, `secondary`, `success`, `danger`. A button posted from a row event remembers its row: its rule
reads `row`.

## Roles

| Action | Example |
|---|---|
| `give role <role> [for <duration>] [to <member>]` | `give role input.vip for 7d`: taken back automatically after 7 days |
| `take role <role> [from <member>]` | `take role input.vip from option.user` |
| `tier roles <table> at <number> [to <member>]` | gives the role of the highest row reached and takes the other rows' roles |

Roles always come from settings, never a role above the bot, never one with Administrator.

```rrl
rule "Streak roles"
when message in input.channels
then tier roles input.rewards at member.streak
```

## Points

`give points <number> [<reason>] [to <member>]` pays into the server's Points (Robtic System records it as "plugin";
at most 1000 per `give`).

## Timers and forms

| Action | Example |
|---|---|
| `start timer "<name>" after <duration> [for <member>]` | starting it again restarts it |
| `stop timer "<name>" [for <member>]` | |
| `show form "<id>"` | only in `command`, `button` and `select` rules |

More on [timers](/rules/data#timers-and-schedules) and [forms](/rules/commands#forms).

## Moderation

The same actions as AutoMod:

`delete` · `warn <text>` · `mute <duration> [<text>]` · `timeout <duration> [<text>]` · `jail [<text>]` ·
`alert [<text>]` · `strike "<name>"` · `slowmode <duration> for <duration>` · `lock for <duration>` · `log <text>`
(writes to the plugin's run log only).

> **Note** Ban, kick and anything on another server aren't allowed.

## Limits

| | |
|---|---|
| Messages sent | 20 a minute; DMs 5 a minute |
| Role changes | 30 a minute; above that the plugin pauses and the server is alerted |
