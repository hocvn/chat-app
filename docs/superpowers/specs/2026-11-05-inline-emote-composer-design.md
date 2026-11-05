# Inline Emote Composer Design

## Intent

Selecting an emote should make it visible and editable in the message composer, then send it as part of the typed message.

## Goals

- Append the selected Unicode emote to the message input value.
- Send the emote through the existing `text` field with any typed words.
- Keep sticker selection and immediate sending unchanged.

## Non-goals

- Do not change the message API, persistence schema, or typed sticker behavior.
- Do not add dependencies.

## Approach

1. **Append to `text` (selected):** Clicking an emote appends its Unicode value to the controlled input. This is directly editable and uses the existing text-message path.
2. **Keep separate emote content:** Retains the current pending preview and structured `content` payload, but does not meet the requirement that the emote appear in the input.

## Interaction

- Selecting an emote appends it to the input, closes the picker, and returns focus to the input.
- Sending submits only the text and optional image payload; no emote `content` payload is added for the inline emote.
- The existing input clear after a successful send removes the emote with the rest of the message.
