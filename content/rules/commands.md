---
title: Commands and forms
description: Give a plugin its own slash commands with options, and pop-up forms members fill in.
---

## Commands

```rrl
command "streak" "View a daily streak"
  option user: member "Who (defaults to you)"

rule "Show a streak"
when command "streak"
then
  let target = option.user or member
  reply embed {
    title: "{target.name}'s streak"
    text: "🔥 **{target.streak}** {plural(target.streak, "day", "days")}"
    color: #f97316
  }
```

```discord
command: /streak by Sara
embed: #f97316
title: Sara's streak
body: 🔥 **12** days
```

- `command "<name>" "<description>"`, with options indented: `option <name>: <type> "<description>" [required]`.
- Option types: `text`, `number`, `bool`, `member`, `role`, `channel`, `duration`.
- The rule reads options as `option.<name>`. `option.user or member` means "the option if given, otherwise whoever
  used the command".
- Commands are registered **only on servers that installed the plugin**. Two plugins on one server can't use the same
  command name. Up to 5 commands per plugin.

## Forms

A form is a pop-up with up to 5 fields.

```rrl
form "apply" "Staff application"
  field age: number "Your age" required
  field why: long_text "Why do you want to join?"

rule "Open the form"
when button "apply"
then show form "apply"

rule "Got an application"
when form "apply"
then
  send embed {
    title: "New application from {member.name}"
    text: "**Age:** {answer.age}\n**Why:** {answer.why}"
  } to input.review_channel
  reply "Sent! The team will get back to you." private
```

- Field types: `text`, `long_text`, `number`.
- `show form` works only in `command`, `button` and `select` rules (Discord needs a click to open a form).
- Up to 3 forms per plugin.
