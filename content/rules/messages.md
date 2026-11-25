---
title: Messages
description: Put values into text, write in two languages, and send plain messages, embeds or components with buttons.
---

## Values in text

Anything inside `{ }` is an expression, filled in when the rule runs:

```rrl
reply "{member.mention} reached {member.streak} days 🔥"
```

```discord
text: @Sara reached 7 days 🔥
```

- Durations show as words ("2 days"), dates as "21 Nov", times as a Discord timestamp, members as their name, roles
  and channels as mentions, `:fire:` as 🔥.
- Write `{{` for a real `{`.
- **Plurals:** `plural(member.streak, "day", "days")`.

## Two languages

```rrl
reply en "Saved!" ar "تم الحفظ!"
```

The bot answers in the server's language (**General → Language** on the dashboard). Any text can be bilingual:
messages, labels, reasons, descriptions.

## Embeds

```rrl
reply embed {
  title: "{target.name}'s streak"
  text: "🔥 **{target.streak}** days"
  footer: if target.streak > 0 then "Keep going!" else "No streak yet"
  color: #f97316
}
```

```discord
embed: #f97316
title: Sara's streak
body: 🔥 **12** days
footer: Keep going!
```

Fields: `title`, `text`, `footer`, `color`, `image`, `thumbnail`. Commas between them are optional. An empty field (a
picture setting nobody uploaded) is left out.

## Components

Discord's newer layout: a container with the colour as its accent, the title and text inside, the picture under them.
It takes the same fields.

```rrl settings
plugin "Partner wall" for system
version 1

input channel: channel "Channel" required
input description: text = "{option.about}" "Description"
input banner: image "Banner"

command "partner" "Post a partner"
  option name: text "Server name" required
  option about: text "About them"

rule "Post"
when command "partner"
then
  send components {
    title: "{option.name}"
    text: input.description
    image: input.banner
    color: #5865f2
  } to input.channel
```

```discord
components: #5865f2
title: Arab Gamers
body: The biggest Arabic gaming community.
image: wide
```

> **Note** Embed or components is the plugin's choice, written in its code. The settings page only asks for the text
> and the picture.

## Private replies

`private` replies are seen only by the person who used the command or button:

```rrl
reply "You can't do that." private
```

```discord
text: You can't do that.
private
```
