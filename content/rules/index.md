---
title: Robtic Rules
description: The plain-English language Robtic plugins are written in. Safe by design, checked as you type, testable.
---

**Robtic Rules** (RRL) is the language behind **plugins**: features a server installs onto a Robtic bot, like daily
streaks, a partner wall or a thank-you for boosters. It reads like English, so you can read a plugin before you install
it, and write one without being a programmer.

```rrl settings
# Thanks people who boost the server.
plugin "Boosts" for system
version 1
icon "rocket"
description "Thanks members who boost the server and gives them a role."

input channel: channel "Thank-you channel" required
input message: text = "Thanks for boosting, {member.mention}! 💜" "Message"
input role: role "Extra role for boosters"

rule "Thank boosters"
when boost
then
  send embed {
    text: input.message
    color: #f47fff
  } to input.channel
  give role input.role

rule "Take the role back"
when boost_end
then take role input.role
```

Switch to **Settings page** above: every `input` line becomes one setting the server fills in. When someone boosts, the
first rule posts this in the channel they picked:

```discord
embed: #f47fff
body: Thanks for boosting, @Sara! 💜
```

## Why it's safe

Robtic Rules is **not a programming language, on purpose**:

- **No loops and no recursion.** Every run has a fixed work budget, so a plugin can't hang or slow the bot down.
- **No network, no files, no hidden state.** A plugin only touches what it declares: its settings, its stored data, its
  commands, and the members and channels of the event that started it.
- **Roles only come from settings.** A plugin can't name a role in its code; the server picks it.
- **Permissions are worked out from the code.** The author never writes them, so a plugin can't hide what it does. You
  see the list before you install.

That makes a plugin from a stranger as safe to install as an AutoMod word list.

## Where you use it

| Place | What you write |
|---|---|
| **Server → Plugins** on the [dashboard](/discord/dashboard) | Whole plugins: settings, rules, commands, tests. Edit them as **Code** or as **Blocks** (the same plugin drawn as boxes). |
| **Robtic System → AutoMod**, advanced mode | AutoMod rules: the older, smaller version of the language. See [AutoMod rules](/discord/system/rules). |

## Files

| | Extension | Inside | Used for |
|---|---|---|---|
| Source | `.rrl` | Plain text, one plugin per file | Writing and editing: the dashboard's editor, VS Code, git |
| Package | `.robtic` | The source, its icon and settings | Sharing: **Server → Plugins → Import** |

## Where to go next

1. [Your first plugin](/rules/first-plugin): build a working plugin step by step.
2. [The basics](/rules/basics): how a file is laid out, values and types.
3. Then the language one part at a time: [settings](/rules/inputs), [rules and events](/rules/rules),
   [actions](/rules/actions), [messages](/rules/messages), [stored data](/rules/data),
   [commands and forms](/rules/commands), [expressions](/rules/expressions).
4. [Tests](/rules/tests) and [publishing](/rules/publishing), and the [reference](/rules/reference) when you need a
   field or a limit.
