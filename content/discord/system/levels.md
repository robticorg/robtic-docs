---
title: Levels & XP
description: Members earn XP by chatting (and in voice), level up, and unlock role rewards.
---

Every qualifying message earns **5–15 XP**, at most once a minute. Level *n* costs `100 × 1.2ⁿ` XP, so early levels
come fast and later ones take real activity. With [Voice](#voice-xp) on, time in voice earns XP on the same levels.

![Levels & XP](/shots/system/levels.webp "Robtic System → Levels & XP")

## Set it up

1. Open **Robtic System → Levels & XP**.
2. Choose **where level-ups are announced** — a channel, or none for silent level-ups.
3. Write the **level-up message**. Use the `{ }` button to insert variables like the member's name and new level.
4. Add **level rewards**: a role given at a level (for example *Active* at level 10).
5. Optional: pick channels that **don't** earn XP (bots, spam channels), and turn on **decay**.
6. Press **Save changes**.

## Decay

Off by default. When on, a member inactive for 7 days loses 10 XP a day, growing by 5 a day, never more than 100 a day.
It keeps the leaderboard about people who are active now.

## Voice XP

Turn on **Robtic System → Voice** to give XP for time in voice channels. Being alone in a channel earns a quarter of the
rate; muted or AFK members earn nothing.

## Commands

| Command | |
|---|---|
| `/level [member]` | Level and XP |
| `/leaderboard` | The XP leaderboard |
| `/level-rewards set · remove · list` | Role rewards (staff) |
| `/profile [member]` | A member's profile card |
