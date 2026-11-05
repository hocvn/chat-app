# Inline Emote Composer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Append selected emotes directly to the message input so they are sent with the typed message.

**Architecture:** Keep the composer as a controlled React input. Replace the pending-emote state with an emote-selection handler that appends the catalog glyph to `text`, closes the picker, and restores input focus. The existing text and image send path remains intact; stickers continue to send through their current typed-content flow.

**Tech Stack:** React 19, Tailwind CSS/DaisyUI, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-05-inline-emote-composer-design.md`

## Global Constraints

- Preserve the existing React, Zustand, Tailwind CSS, and DaisyUI architecture.
- Do not add dependencies or change API contracts.
- Keep immediate sticker sending unchanged.
- Keep the picker contained in the composer and independently scrollable.

## Review Focus

- Selecting an emote when text exists appends rather than replaces the existing text.
- Selecting multiple emotes preserves selection order.
- An emote-only input enables Send and sends via `text`.
- The input regains focus after selection for uninterrupted typing.
- Sticker selection still sends `{ type: "sticker", value: stickerId }` immediately.

---

### Task 1: Append emotes to the composer input

**Files:**
- Modify: `frontend/src/components/MessageInput.jsx`
- Modify: `frontend/test/messageCatalog.test.js`

**Interfaces:**
- Consumes: `EMOTES`, where each item provides `{ id, value, label }`.
- Produces: a `MessageInput` picker handler that appends `emote.value` to the controlled `text` input and submits that resulting text through `sendMessage`.

- [x] **Step 1: Write the failing regression test**

In `frontend/test/messageCatalog.test.js`, add a pure helper-level assertion for the inline-emote text behavior: appending `"😀"` to `"Hello "` produces `"Hello 😀"`, and appending to an empty string produces `"😀"`.

- [x] **Step 2: Run the frontend test to verify it fails**

Run: `npm test -- --test-name-pattern='appends an emote to composer text'`

Expected: FAIL because the text-appending helper does not exist.

- [x] **Step 3: Implement the minimal inline-emote behavior**

Export a small pure helper from `frontend/src/constants/messageCatalog.js` that returns the existing text followed by the selected emote value. In `frontend/src/components/MessageInput.jsx`, use it to update `text`, close the picker, remove the pending-emote preview/state and structured emote `content` payload, and focus the text input with a ref after selection.

- [x] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- --test-name-pattern='appends an emote to composer text'`

Expected: PASS.

- [x] **Step 5: Run full frontend verification**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, lint reports no errors, and the Vite production build exits 0.

- [x] **Step 6: Commit the focused change**

```bash
git add frontend/src/components/MessageInput.jsx frontend/src/constants/messageCatalog.js frontend/test/messageCatalog.test.js
git commit -m "feat: insert emotes into message input"
```
