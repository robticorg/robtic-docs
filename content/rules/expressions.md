---
title: Expressions and functions
description: Operators and their order, "or else", inline if, comparisons, regex, and every built-in function.
---

## Operators

Strongest first:

| Operator | |
|---|---|
| `.name`, `(…)` | field, method call |
| `-x` | minus |
| `*` `/` | |
| `+` `-` | |
| `=` `!=` `<` `<=` `>` `>=` `contains` `starts_with` `ends_with` `matches` `in` `not in` | compare |
| `not` | |
| `and` | |
| `or` | |

- **`or` with values that aren't yes/no means "or else":** `option.user or member` is the option if given, otherwise
  the member. `input.announce or here` is the setting if filled, otherwise this channel.
- **Inline if:** `if x > 0 then "yes" else "no"`.
- **Lists:** `x in list`, `x not in list`, and `list any in list` (`message.links any in list.trusted`).
- **Regex:** `matches` uses Rust / RE2 syntax, which can't hang. At most 50 per plugin, 260 characters each.

## Functions

| Function | Gives |
|---|---|
| `max(a, b)`, `min(a, b)`, `round(n)` | number (or duration) |
| `random(a, b)` | a whole number from a to b |
| `choose(a, b, …)` | one of them at random |
| `lower(t)`, `upper(t)`, `length(t or list)` | |
| `normalize(t)` | lowercase, Arabic letter variants joined, `@`→a, `0`→o, spaced letters joined (as in AutoMod) |
| `any_word(t, words)` | yes if `t` contains any of the words, after `normalize` |
| `plural(n, one, many)` | text |
| `lookup(values, keys, key)` | the value where `keys` holds `key`; empty when none |
| `top(member.<store>, n) as "<line>"` | a ranking as lines of text; use `{rank}` `{name}` `{mention}` `{value}` in the line |

### A leaderboard in one line

```rrl
command "streak-top" "The longest streaks"

rule "Top streaks"
when command "streak-top"
then reply embed {
  title: "🔥 Longest streaks"
  text: top(member.streak, 5) as "**{rank}.** {mention}: {value} days"
  color: #f97316
}
```

```discord
embed: #f97316
title: 🔥 Longest streaks
body: **1.** @Sara: 41 days
body: **2.** @Omar: 30 days
body: **3.** @Lina: 22 days
```

### Matching words in any spelling

```rrl
input banned: words "Words to remove"

rule "Banned words"
when message
if any_word(message.content, input.banned)
then delete, warn "Please keep it clean."
```

`any_word` normalises both sides first, so `h3llo`, `H E L L O` and Arabic letter variants still match.
