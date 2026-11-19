---
title: Secrets
description: Environment variables, encrypted — tokens and passwords stay out of your code.
---

Add tokens, passwords and API keys under **Secrets**. They're encrypted, and your app reads them as environment
variables (`process.env.DISCORD_TOKEN`, `os.environ["DISCORD_TOKEN"]`…). Upload a `.env` file and its values are moved
into secrets for you.

![Secrets](/shots/hosting/secrets.webp)

> **Warning** Never commit a token to GitHub. If one leaks, reset it at its source (for a bot, the Discord Developer Portal) and update the secret.
