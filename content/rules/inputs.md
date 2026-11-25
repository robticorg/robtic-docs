---
title: Settings (inputs)
description: Every input becomes one setting on the plugin's settings page. Types, defaults, required settings and tables.
---

Each `input` line becomes **one setting** on the plugin's settings page in the dashboard. Rules read it as
`input.<name>`. The server fills them in; your code never names a role or a channel itself.

```rrl settings
plugin "Welcome" for system
version 1

## Where the welcome message goes.
input channel: channel "Welcome channel" required
input message: text = "Welcome to the server, {member.mention}!" "Message"
input color: color = #1793ff "Colour"
input banner: image "Banner"
input role: role "Role for new members"
input delay: duration = 5m "Wait before giving the role"
input ping: bool = off "Mention them outside the embed too"
```

Open **Settings page** to see how each type is drawn.

## Writing an input

`input <name>: <type> [= <default>] "<label>" [required]`

| Part | Meaning |
|---|---|
| `<name>` | What rules call it: `input.channel` |
| `<type>` | What kind of setting (below) |
| `= <default>` | The value before the server changes it |
| `"<label>"` | What the settings page shows. Can be two languages: `en "Channel" ar "الروم"` |
| `required` | The plugin can't be switched on until this is filled |
| `## …` above it | Help text under the setting |

## Types

| Input type | The setting looks like | Value in rules |
|---|---|---|
| `text` | text box | text |
| `number`, `percent`, `duration` | number box with its unit | that type |
| `bool` | switch | bool |
| `color` | colour picker | color |
| `emoji` | emoji picker | emoji |
| `image` | picture upload | the picture, for an embed's `image` or `thumbnail` |
| `role` / `roles` | role picker / several roles | role / list of roles |
| `channel` / `channels` | channel picker / several | channel / list of channels |
| `words` | tall list, one per line | list of text |
| `table` | rows with columns and an **Add** button | table (below) |

- Text the server types can hold values too: `Thanks, {member.mention}!` is filled when the rule runs.
- `image`, `role(s)` and `channel(s)` can't have a default: the server uploads or picks them.
- **An empty setting skips its part.** Sending to an empty channel setting does nothing, giving an empty role setting
  gives nothing, unless the setting is `required`.

## Tables

A table is a list of rows the server builds, each with the same columns. List the columns indented under the input:

```rrl settings
plugin "Rewards" for system
version 1

input rewards: table "Reward roles"
  days: number "Days"
  role: role "Role"
```

- `input.rewards.days` is the list of every row's days.
- `tier roles input.rewards at member.streak` gives the role of the highest row reached (see [Actions](/rules/actions#roles)).
- `lookup(input.rewards.role, input.rewards.days, 30)` finds one value by another.

Columns can be `text`, `number`, `duration`, `role`, `channel`, `emoji`, `member` (a Discord user ID) and `image`.

### Rows are events

When the server **adds a row** on the settings page, a rule `when row_added "<table>"` runs once for that row, with it
as `row`. `row_edited` and `row_removed` (the row as it was) work the same way.

```rrl settings
plugin "Partners" for system
version 1

input channel: channel "Partners channel" required
input role: role "Representative role"
input partners: table "Partners"
  name: text "Server name"
  representative: member "Representative"
  banner: image "Banner"

store row.post: text

rule "Announce a new partner"
when row_added "partners"
then
  send components {
    title: "{row.name}"
    image: row.banner
  } to input.channel as row.post
  give role input.role to row.representative

rule "Remove a partner"
when row_removed "partners"
then
  delete row.post
  take role input.role from row.representative
```

The first time the engine sees a table it only notes the rows already there, so installing a plugin never re-announces
them. `send … as row.post` keeps the message, so a later edit updates it instead of posting again.

```discord
components: #5865f2
title: Arab Gamers
image: wide
```
