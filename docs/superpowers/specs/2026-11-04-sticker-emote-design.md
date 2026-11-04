# Sticker and Emote Messages — Design

## Intent

Let people express themselves in a direct conversation with a built-in choice of emotes or stickers, without uploading content or relying on a third-party picker. Emotes should compose with typed text; stickers should stand alone and send immediately.

## Goals

- Add a compact popover above the message composer with distinct **Emotes** and **Stickers** sections.
- Provide a fixed, app-owned starter catalog of Unicode emotes and original static sticker images.
- Permit an emote and typed text to be submitted through the existing Send button.
- Send a sticker immediately when it is selected.
- Persist and deliver both formats through the existing REST and Socket.IO message flow, including offline history.
- Render each content type distinctly in the chat thread.

## Non-goals

- User-uploaded stickers, custom sticker packs, search, favorites, GIFs, animation, reactions on existing messages, and editing/deleting messages.
- Changes to the existing image attachment feature.

## Constraints

- Keep the current React, Zustand, Express, Mongoose, and Socket.IO architecture.
- Stickers are packaged app assets rather than Cloudinary uploads.
- Existing text and image messages must continue rendering unchanged.

## Approaches considered

1. **Dedicated typed message payload — selected.** Persist an explicit content object with `type` (`emote` or `sticker`) plus a catalog value/ID. The frontend maps the catalog ID to its bundled display asset. This keeps the new formats distinct from text and user image attachments, preserves historical messages, and can grow safely.
2. **Separate optional `emote` and `sticker` fields.** Straightforward but adds more mutually-exclusive message fields and makes validation/rendering harder to extend.
3. **Reuse `text` and `image`.** Avoids a backend migration but cannot reliably tell a sticker from a photo attachment or an emote from ordinary text.

## Design details

- A single picker control in `MessageInput` opens the selected compact popover layout; it contains labeled Emotes and Stickers sections.
- Selecting an emote stores it as pending composer content. It is sent with any typed text when the existing Send button is used; a selected emote alone is also sendable.
- Selecting a sticker immediately posts a typed sticker payload and closes the picker.
- The starter catalog will contain a small, original static collection created for this app. Exact artwork and catalog IDs are an implementation choice; they will be local frontend assets, not remotely uploaded files.
- Backend validation accepts typed content only for known supported kinds. The new payload is saved on the `Message` document and returned/emitted unchanged.
- The chat renderer displays Unicode emotes alongside any message text and resolves sticker IDs to the corresponding local asset. Text and uploaded image behavior remains as it is today.

## Builder decisions remaining

- Select the small starter catalog and create its original static artwork.
- Choose the exact field name and schema shape for the typed content object, consistent with current model conventions.
- Add focused validation/tests if the repository’s existing test setup supports them; otherwise validate via available build/lint checks and manual message-flow verification.
