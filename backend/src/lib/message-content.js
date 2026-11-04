export const MESSAGE_CONTENT_TYPES = ["emote", "sticker"];

export const isValidMessageContent = (content) => {
    return Boolean(
        content &&
        typeof content === "object" &&
        !Array.isArray(content) &&
        MESSAGE_CONTENT_TYPES.includes(content.type) &&
        typeof content.value === "string" &&
        content.value.trim()
    );
};

export const hasMessageBody = ({ text, image, content }) => {
    return Boolean(text?.trim() || image || isValidMessageContent(content));
};
