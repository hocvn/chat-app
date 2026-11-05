export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🎉"];

export const isValidReactionEmoji = (emoji) => REACTION_EMOJIS.includes(emoji);

export const toggleReaction = (reactions, emoji, userId) => {
    const normalizedUserId = userId.toString();
    const nextReactions = reactions.map((reaction) => ({
        emoji: reaction.emoji,
        userIds: reaction.userIds.map((id) => id.toString()),
    }));
    const reactionIndex = nextReactions.findIndex((reaction) => reaction.emoji === emoji);

    if (reactionIndex === -1) {
        return [...nextReactions, { emoji, userIds: [normalizedUserId] }];
    }

    const reaction = nextReactions[reactionIndex];
    const hasReacted = reaction.userIds.includes(normalizedUserId);
    const userIds = hasReacted
        ? reaction.userIds.filter((id) => id !== normalizedUserId)
        : [...reaction.userIds, normalizedUserId];

    if (userIds.length === 0) {
        return nextReactions.filter((_, index) => index !== reactionIndex);
    }

    return nextReactions.map((currentReaction, index) => (
        index === reactionIndex ? { ...currentReaction, userIds } : currentReaction
    ));
};
