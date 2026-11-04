export const MESSAGE_CONTENT_TYPES = ["emote", "sticker"];
export const STICKER_IDS = ["party-cat", "rainbow-star", "pizza-party", "rocket-hello"];

export const isValidMessageContent = (content) => {
    return Boolean(
        content &&
        typeof content === "object" &&
        !Array.isArray(content) &&
        MESSAGE_CONTENT_TYPES.includes(content.type) &&
        typeof content.value === "string" &&
        content.value.trim() &&
        (content.type !== "sticker" || STICKER_IDS.includes(content.value))
    );
};

export const hasInvalidSuppliedContent = (body) => {
    return Object.hasOwn(body, "content") && !isValidMessageContent(body.content);
};

export const hasMessageBody = ({ text, image, content }) => {
    return Boolean(text?.trim() || image || isValidMessageContent(content));
};
