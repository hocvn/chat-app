import assert from "node:assert/strict";
import test from "node:test";
import { hasMessageBody, isValidMessageContent } from "../src/lib/message-content.js";

test("accepts built-in emote and sticker payloads", () => {
    assert.equal(isValidMessageContent({ type: "emote", value: "😀" }), true);
    assert.equal(isValidMessageContent({ type: "sticker", value: "party-cat" }), true);
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
