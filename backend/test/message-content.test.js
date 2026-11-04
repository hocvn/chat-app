import assert from "node:assert/strict";
import test from "node:test";
import Message from "../src/models/message.model.js";
import { hasInvalidSuppliedContent, hasMessageBody, isValidMessageContent } from "../src/lib/message-content.js";

test("accepts built-in emote and sticker payloads", () => {
    assert.equal(isValidMessageContent({ type: "emote", value: "😀" }), true);
    assert.equal(isValidMessageContent({ type: "sticker", value: "party-cat" }), true);
});

test("rejects stickers outside the built-in catalog", () => {
    assert.equal(isValidMessageContent({ type: "sticker", value: "not-in-catalog" }), false);
});

test("rejects malformed message content payloads", () => {
    assert.equal(isValidMessageContent({ type: "emote" }), false);
    assert.equal(isValidMessageContent({ type: "unknown", value: "😀" }), false);
    assert.equal(isValidMessageContent("😀"), false);
});

test("requires a text, image, or valid content payload", () => {
    assert.equal(hasMessageBody({ text: "", image: null, content: null }), false);
    assert.equal(hasMessageBody({ text: " hello ", image: null, content: null }), true);
    assert.equal(hasMessageBody({ text: "", image: null, content: { type: "sticker", value: "party-cat" } }), true);
});

test("rejects falsy content supplied alongside text", () => {
    assert.equal(hasInvalidSuppliedContent({ text: "hello", content: false }), true);
    assert.equal(hasInvalidSuppliedContent({ text: "hello", content: "" }), true);
    assert.equal(hasInvalidSuppliedContent({ text: "hello" }), false);
});

test("requires complete content objects in persisted messages", () => {
    const invalidMessage = new Message({ senderId: "507f1f77bcf86cd799439011", receiverId: "507f1f77bcf86cd799439012", content: { value: "party-cat" } });
    assert.ok(invalidMessage.validateSync()?.errors["content.type"]);
});
