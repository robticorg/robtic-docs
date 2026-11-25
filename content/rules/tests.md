---
title: Tests
description: Prove a plugin works with tests that run in the editor, in review and before every publish.
---

Tests live inside the plugin. They run in the dashboard's test bench, in review, and **before every publish**. They
never touch Discord: each one starts on a fresh pretend server at 2026-01-01 12:00 UTC.

```rrl
test "only one claim a day"
  given input.channels = [channel "general"]
  given member.streak = 3
  given member.claimed = today
  when message "hello again" in channel "general"
  expect member.streak = 3
  expect nothing
```

## Lines

| Line | Meaning |
|---|---|
| `given <field> = <value>` | set a setting, a stored value or a member field before the test |
| `let sara = member "Sara"` | a pretend member (also `channel "general"`, `role "Staff"`; tests only) |
| `when <event> ["<name>"] ["<content>"] [in <channel>] [by <member>] [with a = x, b = y]` | pretend the event happens; `with` fills options, form answers or member fields |
| `when row_added "partners" with name = "X", representative = sara` | a row event; `with` fills the row's columns |
| `wait <duration>` | move the clock forward; timers that run out fire |
| `expect <condition>` | must be true now |
| `expect reply` / `send` / `edit` / `dm` / `reaction` / `role` `[contains "<text>"]` | that happened in the last `when` |
| `expect nothing` | the last `when` did nothing members can see (timers don't count) |

The test member is `member` ("Tester", not an admin) unless `by` names someone else.

## Timers in tests

`wait` moves the clock and fires timers in order (and takes back roles given `for` a while). After a `wait`,
`expect reply` / `dm` / … look at what those timers did:

```rrl
test "a missed day ends the streak"
  given input.channels = [channel "general"]
  when message "hi" in channel "general"
  expect member.streak = 1
  wait 2d
  expect member.streak = 0
  expect dm contains "ended"
```

> **Note** Tests can't fill a `table` setting yet.

## Running them

- In the dashboard: the plugin editor runs them for you.
- On your computer: `rrl test streaks.rrl`.
- Publishing runs them all; a failing test stops the publish.
