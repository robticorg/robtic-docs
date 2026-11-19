---
title: Robtic Guard
description: Stops scam raids: the same image posted across many channels within seconds.
---

Scam raids follow a pattern: one account posts the **same image** in several channels within seconds. Robtic Guard
spots it, deletes every copy, times the account out and alerts your moderators.

![Robtic Guard](/shots/guard/overview.webp)

## Set it up

1. [Add Robtic Guard](/discord/dashboard) to your server.
2. **Detection**: how many channels, within how many seconds, count as a raid (default 3 channels in 60 seconds).
3. **Actions**: delete the messages, time the account out (and for how long), alert a channel and mention roles.
4. **Exceptions**: channels and roles Robtic Guard leaves alone.

![Detection](/shots/guard/detection.webp)

> **Note** The bot needs **Manage Messages** and **Timeout Members**. Server administrators are never timed out.
