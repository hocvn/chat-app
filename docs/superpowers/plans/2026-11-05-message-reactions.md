# Message Reactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow participants in a direct conversation to toggle fixed emoji reactions on a message, with persisted and live-updated grouped counts.

**Architecture:** Store grouped reactions directly on `Message` documents as `{ emoji, userIds }` entries. A protected REST endpoint authorizes either conversation participant, toggles their user ID for an allowed emoji, and emits the saved message to both online participants. The Zustand store replaces the matching open-thread message on local success or `messageReactionUpdated` socket delivery; the chat UI renders compact grouped buttons below each bubble.

**Tech Stack:** React 19, Zustand, Express 4, Mongoose 8, Socket.IO 4, Node.js built-in test runner, Tailwind/DaisyUI.

**Spec:** `docs/superpowers/specs/2026-11-05-message-reactions-design.md`

## Global Constraints

- Use a fixed common-emoji reaction set; do not add an emoji picker or dependencies.
- Only a message sender or receiver may add or remove reactions.
- Persist reactions on the `Message` document; do not introduce a reactions collection.
- A second selection of the same emoji by the same user removes that user from the reaction.
- Delete an emoji group when its final reacting user removes it.
- Existing messages without `reactions` must continue to render normally.

## Review Focus

- A third authenticated user must receive `403` and no mutation when attempting to react to a message outside their conversation.
- An emoji outside the fixed set must receive `400` and no mutation.
- Removing the final user from an emoji must remove its empty group rather than render a zero count.
- Both the message sender and receiver need the live update even when only one participant initiated the toggle.
- A reaction update received while a different conversation is selected must not alter the displayed thread.

---

## File Structure

- `backend/src/lib/message-reactions.js`: allowed reaction values and pure validation/toggle helpers.
- `backend/src/models/message.model.js`: embedded `reactions` schema on messages.
- `backend/src/controllers/message.controller.js`: authenticated toggle controller and participant-only socket delivery.
- `backend/src/routes/message.route.js`: `POST /:id/reactions` endpoint.
- `backend/test/message-reactions.test.js`: backend unit coverage for validation, toggling, and schema validation.
- `frontend/src/constants/messageCatalog.js`: exported fixed reaction metadata and pure display helpers.
- `frontend/test/messageCatalog.test.js`: unit coverage for reaction metadata and grouped-reactor helpers.
- `frontend/src/store/useChatStore.js`: request action and scoped socket replacement for reaction updates.
- `frontend/src/components/ChatContainer.jsx`: reaction-picker control and grouped reaction buttons.
- `docs/SPEC.md`, `docs/ARCHITECTURE.md`: user-facing API/model/event documentation.

### Task 1: Add persistent reaction data and backend helpers

**Files:**
- Create: `backend/src/lib/message-reactions.js`
- Create: `backend/test/message-reactions.test.js`
- Modify: `backend/src/models/message.model.js:3-35`

**Interfaces:**
- Produces: `REACTION_EMOJIS: readonly string[]`, `isValidReactionEmoji(emoji): boolean`, and `toggleReaction(reactions, emoji, userId): Array<{emoji: string, userIds: string[]}>`.
- Produces: `Message.reactions: Array<{ emoji: String, userIds: ObjectId[] }>` with an empty-array default.

- [ ] **Step 1: Write failing helper and model tests**

```js
test("accepts only the fixed reaction emojis", () => {
  assert.equal(isValidReactionEmoji("👍"), true);
  assert.equal(isValidReactionEmoji("🫠"), false);
});

test("toggles a user's grouped reaction and removes an empty group", () => {
  const added = toggleReaction([], "👍", "user-a");
  assert.deepEqual(added, [{ emoji: "👍", userIds: ["user-a"] }]);
  assert.deepEqual(toggleReaction(added, "👍", "user-a"), []);
});

test("requires an emoji for persisted reaction groups", () => {
  const message = new Message({ senderId: ID_A, receiverId: ID_B, reactions: [{ userIds: [ID_A] }] });
  assert.ok(message.validateSync()?.errors["reactions.0.emoji"]);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npm test --prefix backend -- test/message-reactions.test.js`

Expected: FAIL because the helper module and `reactions` schema do not exist.

- [ ] **Step 3: Implement the fixed reaction helper and embedded Mongoose schema**

Use the agreed common reactions `👍`, `❤️`, `😂`, `😮`, and `🎉`. `toggleReaction` must return plain serializable groups, must not mutate its input, must add a user to an existing group, remove that user on repeat selection, and remove groups with no user IDs.

- [ ] **Step 4: Run the backend reaction tests to verify they pass**

Run: `npm test --prefix backend -- test/message-reactions.test.js`

Expected: PASS.

- [ ] **Step 5: Commit the persistent reaction foundation**

```bash
git add backend/src/lib/message-reactions.js backend/src/models/message.model.js backend/test/message-reactions.test.js
git commit -m "feat: add persistent message reactions"
```

### Task 2: Toggle reactions through the API and Socket.IO

**Files:**
- Modify: `backend/src/controllers/message.controller.js:1-76`
- Modify: `backend/src/routes/message.route.js:1-13`
- Modify: `backend/test/message-reactions.test.js`

**Interfaces:**
- Consumes: `isValidReactionEmoji` and `toggleReaction` from Task 1.
- Produces: authenticated `POST /api/messages/:id/reactions` accepting `{ emoji: string }`, returning the saved `Message`.
- Produces: `messageReactionUpdated` Socket.IO payload containing the saved `Message` for both conversation participants.

- [ ] **Step 1: Add failing controller-behavior tests with model and socket doubles**

Cover a valid participant request returning the updated message and emitting once to each distinct online participant; a non-participant response of `403`; and an unsupported emoji response of `400`. Verify that rejected requests do not save or emit.

- [ ] **Step 2: Run the backend reaction tests to verify the controller cases fail**

Run: `npm test --prefix backend -- test/message-reactions.test.js`

Expected: FAIL because `toggleMessageReaction` and the route do not exist.

- [ ] **Step 3: Implement `toggleMessageReaction(req, res)` and register its protected route**

Find by `req.params.id`; return `404` if absent. Compare `req.user._id` against `message.senderId` and `message.receiverId` before calling `toggleReaction`. Save the message, emit `messageReactionUpdated` to each unique available socket ID for sender and receiver, then return `200` with the saved message.

- [ ] **Step 4: Run the backend reaction tests to verify they pass**

Run: `npm test --prefix backend -- test/message-reactions.test.js`

Expected: PASS.

- [ ] **Step 5: Commit the API and real-time delivery**

```bash
git add backend/src/controllers/message.controller.js backend/src/routes/message.route.js backend/test/message-reactions.test.js
git commit -m "feat: sync message reaction updates"
```

### Task 3: Render and synchronize reactions in the chat client

**Files:**
- Modify: `frontend/src/constants/messageCatalog.js:1-21`
- Modify: `frontend/test/messageCatalog.test.js:1-28`
- Modify: `frontend/src/store/useChatStore.js:6-70`
- Modify: `frontend/src/components/ChatContainer.jsx:1-95`

**Interfaces:**
- Consumes: `POST /messages/:id/reactions` and `messageReactionUpdated` from Task 2.
- Produces: `REACTION_EMOTES: Array<{value: string, label: string}>`, `hasReacted(reaction, userId): boolean`, and `replaceMessage(messages, updatedMessage): Message[]`.
- Produces: `toggleReaction(messageId, emoji): Promise<void>` on `useChatStore`.

- [ ] **Step 1: Extend frontend catalog tests with reaction metadata and replacement behavior**

```js
test("provides the fixed reaction set", () => {
  assert.deepEqual(REACTION_EMOTES.map(({ value }) => value), ["👍", "❤️", "😂", "😮", "🎉"]);
});

test("replaces only the matching message after a reaction update", () => {
  assert.deepEqual(replaceMessage([{ _id: "a" }, { _id: "b" }], { _id: "b", reactions: [] }), [{ _id: "a" }, { _id: "b", reactions: [] }]);
});
```

- [ ] **Step 2: Run the frontend catalog tests to verify they fail**

Run: `npm test --prefix frontend -- test/messageCatalog.test.js`

Expected: FAIL because reaction exports do not exist.

- [ ] **Step 3: Implement catalog helpers, store synchronization, and compact message controls**

Export the fixed five reactions from `messageCatalog.js`. In the store, post `{ emoji }` to `/messages/${messageId}/reactions`, replace the matching local message from the response, and listen for `messageReactionUpdated` only when its sender/receiver pair matches the selected conversation and authenticated user. In `ChatContainer`, render a small `+` reaction chooser and grouped emoji-count buttons beneath each message; visually distinguish buttons reacted to by `authUser`. Clicking a visible group toggles that emoji, while selecting from the chooser creates/toggles a new group.

- [ ] **Step 4: Run unit tests, lint, and production build**

Run: `npm test --prefix frontend -- test/messageCatalog.test.js && npm run lint --prefix frontend && npm run build --prefix frontend`

Expected: all commands pass with zero lint errors and a successful Vite build.

- [ ] **Step 5: Commit the client UI and state changes**

```bash
git add frontend/src/constants/messageCatalog.js frontend/test/messageCatalog.test.js frontend/src/store/useChatStore.js frontend/src/components/ChatContainer.jsx
git commit -m "feat: add chat message reaction controls"
```

### Task 4: Document the reaction contract and run the full suite

**Files:**
- Modify: `docs/SPEC.md:31-37, 99-115, 134-144`
- Modify: `docs/ARCHITECTURE.md:140-143, 202-205, 225-230`

**Interfaces:**
- Consumes: final endpoint, model field, and event names from Tasks 1–3.
- Produces: accurate product, REST, model, and real-time architecture documentation.

- [ ] **Step 1: Update the specification and architecture documentation**

Document grouped fixed-emoji reactions in direct conversations; `POST /api/messages/:id/reactions`; the `reactions` message field; and the `messageReactionUpdated` event delivered to both participants.

- [ ] **Step 2: Run the complete backend and frontend checks**

Run: `npm test --prefix backend && npm test --prefix frontend && npm run lint --prefix frontend && npm run build --prefix frontend`

Expected: all test suites pass, lint has zero errors, and the production build succeeds.

- [ ] **Step 3: Commit documentation and final verification state**

```bash
git add docs/SPEC.md docs/ARCHITECTURE.md
git commit -m "docs: describe message reactions"
```

## Self-Review

- **Spec coverage:** Tasks 1–2 provide persistent, participant-authorized, real-time reactions; Task 3 provides selection, grouped counts, removal, and backward-compatible rendering; Task 4 documents all public changes.
- **Step scan:** Each task begins with a failing test and ends with the exact verification and focused commit needed for its deliverable.
- **Type consistency:** Backend helper uses `{ emoji, userIds }`; Mongoose stores IDs; API and socket send complete message documents; the frontend always consumes `message.reactions` and replaces by `_id`.
- **Review focus:** Authorization and invalid emoji behavior are covered in Task 2; empty groups in Task 1; sender/receiver delivery in Task 2; selected-conversation scoping is covered by Task 3’s implementation and must receive an explicit unit test during execution.
- **Proportion:** Four independently testable deliverables cover the model, transport, UI/state, and documentation without new dependencies or unrelated refactors.
