---
title: Panels
description: Build messages with buttons and menus: rules, info, role pickers and menus that open other panels.
---

Panels are messages you design on the dashboard and Robtic System posts for you: a rules message, an info page, a
role picker, a menu whose options open other panels. Up to 25 panels per server.

![Panels](/shots/system/panels.webp "Robtic System → Panels: every panel, where it's posted, and its Post / Update button")

## Create a panel

1. Open **Robtic System → Panels** and press **New panel**.
2. Give it a **name** (only you see it) and pick the channel under **Post in…**.
3. Choose the style: **Embed** (a classic Discord embed) or **Components** (Discord's newer layout: text, images,
   sections and separators, all inside one message).
4. Build the message (below), then press **Done**.
5. Press **Save changes**, then **Post** on the panel's row. After later edits, the same button says **Update** and edits
   the message already in Discord — members keep their place, nothing is reposted.

![The panel editor](/shots/system/panel-editor.webp "The editor shows the message exactly as Discord will")

## Editing

- **Click any part** to edit it: the title, the text, an image, a button.
- **Add a block** with the blue **+** that appears between blocks.
- **Move a block**: press it and move the mouse — the others slide out of the way. (Or select it and press
  **Alt + ↑ / ↓**.)
- The toolbar above a selected block duplicates, removes or changes it.
- Use the **{ }** button wherever it appears to insert variables, like the member's name.

### Blocks (Components style)

| Block | What it is |
|---|---|
| **Container** | A card with an accent colour that holds other blocks. |
| **Text** | Markdown text: headings, lists, links, mentions. |
| **Section** | Up to 3 lines of text with a thumbnail or a button beside them. |
| **Image gallery** | 1 to 10 images or GIFs. |
| **Separator** | A divider line or a gap. |
| **Buttons** | A row of up to 5 buttons. |
| **Menu** | A dropdown with up to 25 options. |

![Components style](/shots/system/panel-editor-components.webp "Components: the message is built from blocks")

## Buttons and menus

Every button (and every menu option) does one thing when it's pressed:

| Action | What happens |
|---|---|
| **Reply** | The member sees a private message only they can read — perfect for FAQs. |
| **Role** | The member gets the role, or loses it if they already have it — a role picker. |
| **Panel** | Another of your panels opens privately for that member — menus with sub-pages. |
| **Link** | Opens a website (link buttons can't do anything else). |

You can also limit a button to some roles, choose its colour (blurple, grey, green, red) and give it an emoji.

> **Tip** Build an info hub: one panel with a menu, each option opening a small panel (Rules, Roles, FAQ, Links).

## Limits

| | |
|---|---|
| Panels per server | 25 |
| Components per message | 40 |
| Text per message | 4,000 characters |
| Buttons per row / options per menu | 5 / 25 |
