---
title: Reference
description: Every field of member, message, channel and server, the limits, and the full grammar.
---

## Fields

### `member.`

| Field | Type |
|---|---|
| `id` `name` `mention` | text |
| `avatar` | image: their picture (for an embed's `thumbnail` or `image`) |
| `is_bot` `is_admin` `is_booster` `timed_out` | bool |
| `was_timed_out` | bool, in `member_update` |
| `account_age` `joined` | duration (since the account was made / since they joined) |
| `roles` | list of roles |
| `has_role(r)` | yes if they have that role (or any role of a list) |
| `level` `warnings` | number (Robtic System) |
| `tag` `tag_before` | text: the ID of the server whose tag they wear ("" for none). `member.tag = server.id` is "wears this server's tag" |
| `messages(10s)` `strikes("name", 1h)` | number in that window |
| any `store member.` field | its type |

### `message.`

| Field | Type |
|---|---|
| `content` `language` | text (`language`: `ar`, `en` or `other`) |
| `length` `words` `lines` `emoji_count` `mention_count` `role_mentions` `link_count` `invites` `attachments` | number |
| `caps_ratio` | percent |
| `links` | list of text (domains) |
| `has_image` `is_reply` `is_forwarded` | bool |
| `matches(regex)` | bool |

### `channel.` and `server.`

| | |
|---|---|
| `channel.` | `id` `name` `mention` (text) · `is_nsfw` (bool) · `messages(5s)` (number) |
| `server.` | `id` `name` (text) · `member_count` `boosts` `boost_level` (number) · `joins(10s)` (number) · `raid_mode` (bool) · any `store server.` field |

## Limits

| | |
|---|---|
| Rules | 30 |
| Commands | 5 |
| Forms | 3, with 5 fields each |
| Settings (inputs) | 25 |
| Store keys | 20 (1 KB per member, 64 KB per server) |
| Lists | 10, 5000 entries in all |
| Regex | 50, 260 characters each |
| Schedules | 1, at most every 10 minutes |
| Timers | up to 30 days, 1000 waiting |
| `if` depth | 3 |
| Messages sent | 20 a minute; DMs 5 a minute |
| Role changes | 30 a minute |
| Work per event | 20,000 steps across all rules |

## Grammar

```
file        = { decl } ;
decl        = header | input | list | store | check | command | form | rule | test | migrate ;
header      = "plugin" TEXT "for" NAME NL | "version" NUMBER NL | "icon" TEXT NL | "description" text NL ;
input       = { "##" DOC NL } "input" NAME ":" type [ "=" expr ] text [ "required" ] NL [ INDENT { column } DEDENT ] ;
column      = NAME ":" type text NL ;
list        = "list" NAME "=" "[" [ TEXT { "," TEXT } ] "]" NL ;
store       = "store" ( "member" | "server" | "row" ) "." NAME ":" type [ "=" expr ] NL ;
check       = "check" NAME "=" expr NL ;
command     = "command" TEXT text NL [ INDENT { "option" NAME ":" type text [ "required" ] NL } DEDENT ] ;
form        = "form" TEXT text NL INDENT { "field" NAME ":" type text [ "required" ] NL } DEDENT ;
rule        = "rule" TEXT NL "when" event NL [ "if" expr NL { ( "and" | "or" ) expr NL } ] "then" ( NL block | stmts NL ) ;
event       = NAME [ TEXT ] [ "in" expr ] | "schedule" "every" DURATION [ "at" TEXT ] ;
block       = INDENT { stmt NL } DEDENT ;
stmts       = stmt { "," stmt } ;
stmt        = "let" NAME "=" expr | "set" path "=" expr | "clear" path | if | action ;
if          = "if" expr ( "then" stmts | NL block ) [ NL "else" ( if | stmts | NL block ) ] ;
test        = "test" TEXT NL INDENT { given | "let" NAME "=" expr | twhen | "wait" expr | expect } DEDENT ;
migrate     = "migrate" "from" NUMBER NL block ;
expr        = or ;  or = and { "or" and } ;  and = not { "and" not } ;  not = "not" not | cmp ;
cmp         = sum [ cmpop sum ] ;  sum = prod { ("+"|"-") prod } ;  prod = unary { ("*"|"/") unary } ;
unary       = "-" unary | postfix ;  postfix = primary { "." NAME | "(" [ expr { "," expr } ] ")" } [ "as" TEXT ] ;
primary     = NUMBER | PERCENT | DURATION | text | COLOR | EMOJI | BOOL | "now" | "today" | "yesterday" | "here"
            | NAME | "(" expr ")" | "[" [ expr { "," expr } ] "]" | "if" expr "then" expr "else" expr ;
text        = TEXT | "en" TEXT "ar" TEXT | "ar" TEXT "en" TEXT ;
```
