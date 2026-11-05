import assert from "node:assert/strict";
import test from "node:test";
import { createSocketAuthenticator, createUserSocketRegistry } from "../src/lib/socket-auth.js";

test("authenticates a socket from its signed token instead of its userId query", async () => {
    const authenticate = createSocketAuthenticator({
        verifyToken: (token) => {
            assert.equal(token, "signed-token");
            return { userId: "user-a" };
        },
        findUserById: async (userId) => ({ _id: userId }),
    });
    const socket = { handshake: { headers: { cookie: "token=signed-token" }, query: { userId: "user-b" } }, data: {} };

    await authenticate(socket, (error) => assert.equal(error, undefined));

    assert.equal(socket.data.userId, "user-a");
});

test("rejects a socket without a valid authentication token", async () => {
    const authenticate = createSocketAuthenticator({
        verifyToken: () => assert.fail("must not verify a missing token"),
        findUserById: async () => assert.fail("must not query a missing token"),
    });
    const socket = { handshake: { headers: {}, query: { userId: "user-a" } }, data: {} };
    let receivedError;

    await authenticate(socket, (error) => {
        receivedError = error;
    });

    assert.match(receivedError.message, /unauthorized/i);
});

test("keeps a user's remaining socket registered when another tab disconnects", () => {
    const registry = createUserSocketRegistry();
    registry.add("user-a", "socket-1");
    registry.add("user-a", "socket-2");

    registry.remove("user-a", "socket-1");

    assert.deepEqual(registry.get("user-a"), ["socket-2"]);
});
