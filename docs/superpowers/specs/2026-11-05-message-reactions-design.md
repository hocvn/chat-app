# Message Reactions Design

## Intent

Let either participant acknowledge a direct-chat message with a small, persistent emoji reaction that is visible immediately to both people.

## Goals

- Provide a fixed set of common emoji reactions from each message bubble.
- Group matching reactions into a count below the message.
- Let a user toggle their own reaction on or off.
- Persist reactions with the message and synchronize updates in real time.

## Non-goals

- Custom emoji, reaction search, or a full emoji picker.
- Group-chat reaction behavior.
- A separate reactions collection, analytics, notifications, or message editing.

## Constraints

- The feature remains within the existing React, Zustand, Express, MongoDB, and Socket.IO stack.
- Only the sender or receiver of a message may react to it.
- No new dependencies are required.

## Approaches

1. A standalone `Reaction` collection offers greater analytical flexibility, but adds unnecessary queries and complexity.
2. **Selected: embed reactions on the message.** Each reaction records a fixed emoji and the IDs of users who selected it. A protected toggle endpoint updates the message and Socket.IO distributes the resulting message to both participants. This is simple, persistent, and fits the current message-centric API.
3. Client-only reactions are not persistent or shared, so they do not meet the intent.

## Interaction and Implementation Shape

- Each message exposes a compact reaction control using a fixed common-emoji set.
- Selecting an emoji adds the current user to that emoji's grouped reaction; selecting it again removes the user. Empty groups are removed.
- The backend validates the emoji, verifies the user belongs to the conversation, saves the message, and emits the updated message to both participants.
- The active client thread replaces its matching message when it receives the reaction update, so counts and selected state update without a refresh.
- Existing messages without a `reactions` field render with no reaction row.
