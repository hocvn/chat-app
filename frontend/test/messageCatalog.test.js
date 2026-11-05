import assert from "node:assert/strict";
import test from "node:test";
import { EMOTES, MESSAGE_PICKER_CLASS_NAME, REACTION_EMOTES, STICKERS, appendEmoteToText, getStickerById, hasReacted, isMessageInConversation, replaceMessage } from "../src/constants/messageCatalog.js";

test("provides a built-in emote and stable unique sticker IDs", () => {
    assert.equal(EMOTES.some(({ value }) => value === "😀"), true);
    assert.deepEqual(STICKERS.map(({ id }) => id), ["party-cat", "rainbow-star", "pizza-party", "rocket-hello"]);
});

test("looks up known stickers and ignores unknown IDs", () => {
    assert.deepEqual(getStickerById("party-cat"), { id: "party-cat", label: "Party cat", src: "/stickers/party-cat.svg" });
    assert.equal(getStickerById("missing"), undefined);
});

test("keeps an overflowing message picker scrollable within its own popover", () => {
    assert.match(MESSAGE_PICKER_CLASS_NAME, /max-h-/);
    assert.match(MESSAGE_PICKER_CLASS_NAME, /overflow-y-auto/);
});

test("anchors the message picker inside the composer at the right edge", () => {
    assert.match(MESSAGE_PICKER_CLASS_NAME, /right-0/);
    assert.doesNotMatch(MESSAGE_PICKER_CLASS_NAME, /left-0/);
});

test("appends an emote to composer text", () => {
    assert.equal(appendEmoteToText("Hello ", "😀"), "Hello 😀");
    assert.equal(appendEmoteToText("", "😀"), "😀");
});

test("provides the fixed reaction set", () => {
    assert.deepEqual(REACTION_EMOTES.map(({ value }) => value), ["👍", "❤️", "😂", "😮", "🎉"]);
});

test("identifies whether a user has reacted", () => {
    assert.equal(hasReacted({ emoji: "👍", userIds: ["user-a"] }, "user-a"), true);
    assert.equal(hasReacted({ emoji: "👍", userIds: ["user-a"] }, "user-b"), false);
});

test("replaces only the matching message after a reaction update", () => {
    assert.deepEqual(
        replaceMessage([{ _id: "a" }, { _id: "b" }], { _id: "b", reactions: [] }),
        [{ _id: "a" }, { _id: "b", reactions: [] }],
    );
});

test("limits reaction updates to the active two-person conversation", () => {
    assert.equal(isMessageInConversation({ senderId: "user-a", receiverId: "user-b" }, "user-a", "user-b"), true);
    assert.equal(isMessageInConversation({ senderId: "user-a", receiverId: "user-c" }, "user-a", "user-b"), false);
});
