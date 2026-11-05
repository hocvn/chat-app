import assert from "node:assert/strict";
import test from "node:test";
import { EMOTES, MESSAGE_PICKER_CLASS_NAME, STICKERS, appendEmoteToText, getStickerById } from "../src/constants/messageCatalog.js";

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
