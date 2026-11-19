---
title: Create a ticket panel
description: The message members press to open a ticket — its options, questions, staff and categories.
---

A **ticket panel** is the message members press to open a ticket. Each **option** on it is one kind of ticket
(*General help*, *Report a member*, *Purchases*…) with its own message, questions, staff and category.

## 1. Create the panel

1. Open **Robtic Ticket**. Under **Panels** in the sidebar, press **New panel**.
2. At the top, pick **Send the panel in** — the channel where members will see it.
3. Optional on the same row: a **log channel**, a **transcript channel** and roles that **can't open tickets** (each
   falls back to **Settings** when empty).

![A ticket panel](/shots/ticket/panel.webp "The panel page: channels on top, the message in the middle, its settings on the right")

## 2. Design the message

The middle shows the panel exactly as Discord will. Click any part to edit it: the title, the text, the image. On the
right:

- **Message** — **Embed** or **Components**.
- **Options as** — the options as **Buttons** (up to 25) or a **Menu**.
- **Staff** — **Support roles** (see and answer the tickets) and **Manager roles** (can also manage them). Each starts
  from the defaults in Settings.
- **Tickets go to** — the **ticket category** new tickets open in, and the **closed category** they move to.

## 3. Add the options

Press **+** next to the buttons to add an option, then click it to open its page. Each option has:

| Setting | |
|---|---|
| **Label and emoji** | What the button or menu option shows. |
| **Ticket message** | The first message in the new ticket — use variables like `{user}`, `{support}` and `{option}` (the **Variables** button lists them all). |
| **Form** | Questions the member answers before the ticket opens; the answers appear in the ticket. |
| **Permissions** | Who may use each control inside the ticket: claim, add, remove, transfer, transcript, close… |
| **Channel name** | For example `ticket-{number}`. |
| **Open at once, per member** | How many tickets of this kind one member may have open (default 1). |
| **Categories** | Its own ticket and closed categories, if different from the panel's. |

![A ticket option](/shots/ticket/option.webp "An option's page: the ticket message with its controls, the form, permissions and categories")

The ticket message carries the **controls** your staff use — Claim, Add, Remove, Transfer, Transcript, Come, Sleep —
as buttons or a menu. Remove the ones you don't need.

## 4. Post it

Press **Save changes**, then **Post in Discord** at the top of the panel. After later edits the button says
**Update in Discord** and edits the posted message in place.

> **Tip** Save a panel as a **template** (Robtic Ticket → Templates) to reuse it on another server, share it by link, or make it public.
