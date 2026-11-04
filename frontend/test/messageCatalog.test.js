import assert from "node:assert/strict";
import test from "node:test";
import { EMOTES, STICKERS, getStickerById } from "../src/constants/messageCatalog.js";

test("provides a built-in emote and stable unique sticker IDs", () => {
    assert.equal(EMOTES.some(({ value }) => value === "😀"), true);
    assert.deepEqual(STICKERS.map(({ id }) => id), ["party-cat", "rainbow-star", "pizza-party", "rocket-hello"]);
});

test("looks up known stickers and ignores unknown IDs", () => {
    assert.deepEqual(getStickerById("party-cat"), { id: "party-cat", label: "Party cat", src: "/stickers/party-cat.svg" });
    assert.equal(getStickerById("missing"), undefined);
});
