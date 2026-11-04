# Sticker and Emote Messages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users select built-in emotes and stickers in a compact composer picker, then send and receive them as persisted direct messages.

**Architecture:** Add an explicit `content` object to messages with `type` (`emote` or `sticker`) and `value` (the Unicode glyph or sticker catalog ID). The server validates and persists that object while the frontend owns a fixed catalog, queues selected emotes alongside text for the normal Send action, and resolves sticker IDs to local static artwork; selecting a sticker sends it immediately.

**Tech Stack:** React 19, Zustand, Tailwind CSS/DaisyUI, Lucide React, Vite, Express 4, Mongoose 8, Socket.IO 4, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-04-sticker-emote-design.md`

## Global Constraints

- Preserve the current React, Zustand, Express, Mongoose, and Socket.IO architecture.
- Use a compact popover with distinct **Emotes** and **Stickers** sections.
- Use fixed Unicode emotes and original static app-owned sticker assets only; do not add uploads, remote pickers, GIFs, or third-party services.
- Emotes wait for the existing Send button and may be sent with text; stickers send immediately on selection.
- Keep current text messages and Cloudinary image attachments working unchanged.
- Do not add dependencies unless a task explicitly requires one; use Node's built-in test runner for new pure/domain tests.

## Review Focus

- Invalid or incomplete `content` payloads must receive a client error rather than be stored; Task 1 pins this with validation tests.
- A message containing only a queued emote must enable and submit through the normal send flow; Task 3 manually verifies it.
- A text message plus a selected emote must preserve and render both elements in order; Task 3 manually verifies it.
- A sticker selection must create exactly one message immediately, not leave pending composer content; Task 3 manually verifies it.
- Legacy text-only, image-only, and text-plus-image messages must render exactly as before; Task 3 manually verifies them.

---

## File Structure

- `backend/src/lib/message-content.js` — Shared server-side allowed content types and payload validation helpers.
- `backend/src/models/message.model.js` — Persisted `content` subdocument alongside legacy text and image fields.
- `backend/src/controllers/message.controller.js` — Request validation and storage of the new message payload.
- `backend/test/message-content.test.js` — Node tests for valid and invalid typed payloads.
- `backend/package.json` — Test script for the built-in Node test runner.
- `frontend/public/stickers/*.svg` — Small original static starter sticker collection served by Vite.
- `frontend/src/constants/messageCatalog.js` — Fixed emote list, sticker metadata, and sticker lookup helper.
- `frontend/test/messageCatalog.test.js` — Node tests for stable catalog IDs and lookup behavior.
- `frontend/package.json` — Test script for the built-in Node test runner.
- `frontend/src/components/MessageInput.jsx` — Picker state and send behavior.
- `frontend/src/components/ChatContainer.jsx` — Typed-content rendering in message bubbles.
- `docs/SPEC.md` and `docs/ARCHITECTURE.md` — Updated product contract and message-flow/data-model documentation.

### Task 1: Typed message content persistence and request validation

**Files:**
- Create: `backend/src/lib/message-content.js`
- Create: `backend/test/message-content.test.js`
- Modify: `backend/src/models/message.model.js`
- Modify: `backend/src/controllers/message.controller.js`
- Modify: `backend/package.json`

**Interfaces:**
- Produces: `MESSAGE_CONTENT_TYPES`, `isValidMessageContent(content)`, and `hasMessageBody({ text, image, content })` from `backend/src/lib/message-content.js`.
- Produces: an optional persisted `Message.content` object of shape `{ type: "emote" | "sticker", value: string }`.
- Produces: `POST /api/messages/send/:id` accepting `{ text?: string, image?: string, content?: { type: "emote" | "sticker", value: string } }` and returning/emitting the saved document.

- [ ] **Step 1: Add a backend test command and write failing domain tests**

Add `"test": "node --test"` to `backend/package.json`. In `backend/test/message-content.test.js`, assert that `{ type: "emote", value: "😀" }` and `{ type: "sticker", value: "party-cat" }` are valid, while missing values, an unknown type, a non-object payload, and an empty `{ text, image, content }` body are invalid.

- [ ] **Step 2: Run the backend domain test to verify it fails**

Run: `npm run test --prefix backend`

Expected: FAIL because `backend/src/lib/message-content.js` does not exist.

- [ ] **Step 3: Implement payload validation and schema support**

Create `backend/src/lib/message-content.js` exporting the interfaces above. Update `backend/src/models/message.model.js` with an optional `content` nested object whose `type` is constrained to `emote` or `sticker` and whose `value` is required whenever the object exists. In `sendMessage`, reject invalid content or a message with no text, image, or valid content using HTTP 400 before any Cloudinary work; save `content` unchanged on valid messages.

- [ ] **Step 4: Run the backend domain tests to verify they pass**

Run: `npm run test --prefix backend`

Expected: PASS.

- [ ] **Step 5: Commit the backend content contract**

```bash
git add backend/package.json backend/src/lib/message-content.js backend/src/models/message.model.js backend/src/controllers/message.controller.js backend/test/message-content.test.js
git commit -m "feat: persist sticker and emote content"
```

### Task 2: Built-in app-owned catalog and starter sticker artwork

**Files:**
- Create: `frontend/public/stickers/party-cat.svg`
- Create: `frontend/public/stickers/rainbow-star.svg`
- Create: `frontend/public/stickers/pizza-party.svg`
- Create: `frontend/public/stickers/rocket-hello.svg`
- Create: `frontend/src/constants/messageCatalog.js`
- Create: `frontend/test/messageCatalog.test.js`
- Modify: `frontend/package.json`

**Interfaces:**
- Produces: `EMOTES`, an array of `{ id: string, value: string, label: string }`; `STICKERS`, an array of `{ id: string, label: string, src: string }`; and `getStickerById(id: string)` from `frontend/src/constants/messageCatalog.js`.
- Consumed by Task 3: catalog IDs are the `content.value` sent for stickers; `content.value` for emotes is the selected Unicode value.

- [ ] **Step 1: Add a frontend test command and write failing catalog tests**

Add `"test": "node --test"` to `frontend/package.json`. In `frontend/test/messageCatalog.test.js`, assert that the catalog includes the emote value `😀`, includes each four fixed sticker IDs (`party-cat`, `rainbow-star`, `pizza-party`, `rocket-hello`) exactly once, and returns the expected metadata for `getStickerById("party-cat")` while returning `undefined` for an unknown ID.

- [ ] **Step 2: Run the frontend catalog test to verify it fails**

Run: `npm run test --prefix frontend`

Expected: FAIL because `frontend/src/constants/messageCatalog.js` does not exist.

- [ ] **Step 3: Create the catalog and original static sticker files**

Create the four accessible, original SVG stickers listed above in `frontend/public/stickers/`. Create `frontend/src/constants/messageCatalog.js` with a small fixed Unicode-emote set including `😀`, stable sticker metadata referencing `/stickers/<id>.svg`, and the lookup helper specified above.

- [ ] **Step 4: Run the frontend catalog tests to verify they pass**

Run: `npm run test --prefix frontend`

Expected: PASS.

- [ ] **Step 5: Commit the catalog and artwork**

```bash
git add frontend/package.json frontend/src/constants/messageCatalog.js frontend/test/messageCatalog.test.js frontend/public/stickers
git commit -m "feat: add built-in sticker and emote catalog"
```

### Task 3: Composer picker, send behavior, and chat rendering

**Files:**
- Modify: `frontend/src/components/MessageInput.jsx`
- Modify: `frontend/src/components/ChatContainer.jsx`
- Modify: `frontend/src/store/useChatStore.js` only if its existing `sendMessage(messageData)` forwarding requires no change; otherwise preserve that signature while passing `content` through unchanged.

**Interfaces:**
- Consumes: `EMOTES`, `STICKERS`, and `getStickerById()` from `frontend/src/constants/messageCatalog.js`.
- Consumes: the Task 1 API payload and response field `message.content`.
- Produces: `MessageInput` that calls `sendMessage({ text, image, content })` for queued emotes and `sendMessage({ content: { type: "sticker", value: stickerId } })` immediately for stickers.

- [ ] **Step 1: Implement the compact picker and composer state**

In `MessageInput.jsx`, add a clearly labeled picker control and an accessible compact popover with separate Emotes and Stickers sections. Track one selected emote value, let a new emote replace the previous selection, include it as `{ type: "emote", value }` on normal form submit, show it in pending composer state, and enable Send when text, image, or a pending emote exists. On sticker selection, call `sendMessage` with its typed sticker payload, close the popover, and do not modify text/image/pending-emote state.

- [ ] **Step 2: Implement typed-content rendering**

In `ChatContainer.jsx`, render `message.content.type === "emote"` as readable Unicode content in the bubble alongside `message.text`; render `message.content.type === "sticker"` as the catalog image returned by `getStickerById(message.content.value)`, with the sticker label as alt text. Ignore an unknown sticker ID without breaking the message list. Leave the existing attachment image and text branches intact.

- [ ] **Step 3: Run lint and production build**

Run: `npm run lint --prefix frontend && npm run build --prefix frontend`

Expected: both commands exit 0.

- [ ] **Step 4: Manually verify the real message flow in two authenticated browser sessions**

Start the backend and frontend with their existing development commands. Verify: an emote-only message sends after Send; text plus an emote renders together for sender and recipient; a sticker sends immediately and appears once for sender and recipient; history retains both types after reload; unknown sticker IDs do not crash the thread; text-only, image-only, and text-plus-image messages still work.

- [ ] **Step 5: Commit the interactive UI**

```bash
git add frontend/src/components/MessageInput.jsx frontend/src/components/ChatContainer.jsx frontend/src/store/useChatStore.js
git commit -m "feat: add sticker and emote message picker"
```

### Task 4: Update product and architecture documentation

**Files:**
- Modify: `docs/SPEC.md`
- Modify: `docs/ARCHITECTURE.md`

**Interfaces:**
- Documents: the Task 1 message payload contract and the Task 2/3 picker behavior.

- [ ] **Step 1: Update the product specification**

In `docs/SPEC.md`, add built-in sticker/emote selection to message input controls and sending flow; document the compact picker, queued-emote/send behavior, immediate-sticker behavior, and `Message.content` shape in the WebSocket payload and data-model sections.

- [ ] **Step 2: Update the technical architecture**

In `docs/ARCHITECTURE.md`, describe the frontend catalog/static-assets boundary, typed content persistence in the message controller/model path, and delivery via the existing `newMessage` event.

- [ ] **Step 3: Review documentation accuracy against implementation**

Run: `git diff --check && git diff -- docs/SPEC.md docs/ARCHITECTURE.md`

Expected: no whitespace errors and documentation matches the selected data contract.

- [ ] **Step 4: Commit the documentation**

```bash
git add docs/SPEC.md docs/ARCHITECTURE.md
git commit -m "docs: describe sticker and emote messages"
```

## Final Verification

- [ ] Run `npm run test --prefix backend`.
- [ ] Run `npm run test --prefix frontend`.
- [ ] Run `npm run lint --prefix frontend`.
- [ ] Run `npm run build --prefix frontend`.
- [ ] Review `git diff --check` and `git status --short`; preserve the pre-existing `backend/src/index.js` change on `fix/image-payload-size-limit`.
- [ ] Confirm the manual two-session flow in Task 3 and review the final diff for accidental generated files or secrets.
