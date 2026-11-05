import assert from "node:assert/strict";
import test from "node:test";
import Message from "../src/models/message.model.js";
import { isValidReactionEmoji, toggleReaction } from "../src/lib/message-reactions.js";
import { createToggleMessageReaction } from "../src/controllers/message.controller.js";

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

const createResponse = () => {
    const response = {};
    response.status = (statusCode) => {
        response.statusCode = statusCode;
        return response;
    };
    response.json = (body) => {
        response.body = body;
        return response;
    };
    return response;
};

test("toggles a participant reaction and notifies both conversation participants", async () => {
    const message = {
        _id: "message-1",
        senderId: ID_A,
        receiverId: ID_B,
        reactions: [],
        saveCalls: 0,
        async save() {
            this.saveCalls += 1;
            return this;
        },
    };
    const emitted = [];
    const toggleMessageReaction = createToggleMessageReaction({
        findMessageById: async () => message,
        getReceiverSocketId: (userId) => ({ [ID_A]: "sender-socket", [ID_B]: "receiver-socket" })[userId],
        io: { to: (socketId) => ({ emit: (event, payload) => emitted.push({ socketId, event, payload }) }) },
    });
    const response = createResponse();

    await toggleMessageReaction({ params: { id: "message-1" }, body: { emoji: "👍" }, user: { _id: ID_A } }, response);

    assert.equal(response.statusCode, 200);
    assert.equal(response.body, message);
    assert.deepEqual(message.reactions, [{ emoji: "👍", userIds: [ID_A] }]);
    assert.equal(message.saveCalls, 1);
    assert.deepEqual(emitted.map(({ socketId, event }) => ({ socketId, event })), [
        { socketId: "sender-socket", event: "messageReactionUpdated" },
        { socketId: "receiver-socket", event: "messageReactionUpdated" },
    ]);
});

test("rejects reaction attempts by non-participants without saving or emitting", async () => {
    const message = { senderId: ID_A, receiverId: ID_B, reactions: [], save: async () => assert.fail("must not save") };
    const toggleMessageReaction = createToggleMessageReaction({
        findMessageById: async () => message,
        getReceiverSocketId: () => assert.fail("must not look up sockets"),
        io: { to: () => assert.fail("must not emit") },
    });
    const response = createResponse();

    await toggleMessageReaction({ params: { id: "message-1" }, body: { emoji: "👍" }, user: { _id: "outsider" } }, response);

    assert.equal(response.statusCode, 403);
});

test("rejects unsupported reaction emojis without looking up or mutating a message", async () => {
    const toggleMessageReaction = createToggleMessageReaction({
        findMessageById: async () => assert.fail("must not look up a message"),
        getReceiverSocketId: () => assert.fail("must not look up sockets"),
        io: { to: () => assert.fail("must not emit") },
    });
    const response = createResponse();

    await toggleMessageReaction({ params: { id: "message-1" }, body: { emoji: "🫠" }, user: { _id: ID_A } }, response);

    assert.equal(response.statusCode, 400);
});
