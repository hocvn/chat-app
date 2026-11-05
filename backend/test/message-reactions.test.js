import assert from "node:assert/strict";
import test from "node:test";
import Message from "../src/models/message.model.js";
import { isValidReactionEmoji, toggleReaction } from "../src/lib/message-reactions.js";

const ID_A = "507f1f77bcf86cd799439011";
const ID_B = "507f1f77bcf86cd799439012";

test("accepts only fixed reaction emojis", () => {
    assert.equal(isValidReactionEmoji("👍"), true);
    assert.equal(isValidReactionEmoji("🫠"), false);
});

test("toggles a user's grouped reaction and removes empty groups", () => {
    const added = toggleReaction([], "👍", "user-a");

    assert.deepEqual(added, [{ emoji: "👍", userIds: ["user-a"] }]);
    assert.deepEqual(toggleReaction(added, "👍", "user-a"), []);
});

test("requires an emoji for persisted reaction groups", () => {
    const message = new Message({
        senderId: ID_A,
        receiverId: ID_B,
        reactions: [{ userIds: [ID_A] }],
    });

    assert.ok(message.validateSync()?.errors["reactions.0.emoji"]);
});
