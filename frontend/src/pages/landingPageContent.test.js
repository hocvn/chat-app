import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_DEMO_MESSAGES, createDemoReply } from "./landingPageContent.js";

test("provides an initial two-sided conversation", () => {
  assert.ok(INITIAL_DEMO_MESSAGES.some((message) => message.isMe));
  assert.ok(INITIAL_DEMO_MESSAGES.some((message) => !message.isMe));
});

test("creates a friendly reply for a sent demo message", () => {
  const reply = createDemoReply(42);

  assert.deepEqual(
    { ...reply, avatar: undefined },
    {
      id: 42,
      sender: "Mira",
      isMe: false,
      text: "I’m here — make an account and keep the conversation going.",
      time: "Just now",
      avatar: undefined,
    }
  );
  assert.equal(typeof reply.avatar, "string");
});
