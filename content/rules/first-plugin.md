---
title: Your first plugin
description: Build a daily-streak plugin from an empty file to a tested plugin, one step at a time.
---

You'll build **Streaks**: members who chat every day grow a streak, and get a 🔥 reaction when it goes up. It takes
five steps, and every step is a complete plugin you can try.

## 1. The header

Every plugin starts with who it is and which bot runs it.

```rrl
plugin "Streaks" for system
version 1
icon "flame"
description en "Daily message streaks." ar "سلاسل الرسائل اليومية."
```

- `for system` means it runs with Robtic System. The others are `ticket`, `staff`, `guard` and `voice`.
- `version` starts at 1 and goes up each time you publish a change.
- Text can be written in two languages; the bot uses the server's language.

## 2. Settings

Settings are what each server chooses for itself. A `##` line just above a setting becomes its help text.

```rrl settings
plugin "Streaks" for system
version 1

## Streaks only count in these channels.
input channels: channels "Channels that count" required
input min_length: number = 5 "Shortest message that counts"
input claim_every: duration = 1d "Time before the next claim"
input reminders: bool = on "DM a reminder before a streak is lost"
```

Open **Settings page** to see what the server gets. `required` means the plugin can't be switched on until it's filled.

## 3. Remember something

A streak has to be stored for each member. Declare it up front:

```rrl
store member.streak: number = 0
store member.claimed: date
```

## 4. The rule

A rule says **when** it runs, **if** it should, and **then** what it does.

```rrl
rule "Claim the daily streak"
when message in input.channels
if  not member.is_bot
and message.length >= input.min_length
and (member.streak = 0 or today - member.claimed >= input.claim_every)
then
  set member.streak = member.streak + 1
  set member.claimed = today
  react :fire:
```

- `when message in input.channels` only runs for messages in the channels the server picked.
- The `if` lines are joined with `and`. Mixing `and` and `or` needs brackets, as in the last line.
- Under `then`, one action per line, indented.

The member's message gets the reaction:

```discord
user: Sara
text: good morning everyone ☀️
reactions: 🔥 1
```

## 5. Prove it works

Tests run in the editor and before every publish. They never touch Discord.

```rrl
test "only one claim a day"
  given input.channels = [channel "general"]
  given member.streak = 3
  given member.claimed = today
  when message "hello again" in channel "general"
  expect member.streak = 3
  expect nothing
```

This one checks that a second message on the same day doesn't count twice.

> **Tip** Write the test first when you add a rule: it's the quickest way to see the rule do what you meant.

## What's next

- Add a `/streak` command that shows someone's streak: [Commands and forms](/rules/commands).
- Send a message when a streak hits 7 days: [Messages](/rules/messages).
- Take the streak away when someone misses a day, with a timer: [Stored data, timers and schedules](/rules/data).
