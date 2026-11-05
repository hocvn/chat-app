export const EMOTES = [
    { id: "grinning", value: "😀", label: "Grinning face" },
    { id: "joy", value: "😂", label: "Face with tears of joy" },
    { id: "heart", value: "❤️", label: "Red heart" },
    { id: "thumbs-up", value: "👍", label: "Thumbs up" },
    { id: "party", value: "🎉", label: "Party popper" },
    { id: "surprised", value: "😮", label: "Surprised face" },
];

export const STICKERS = [
    { id: "party-cat", label: "Party cat", src: "/stickers/party-cat.svg" },
    { id: "rainbow-star", label: "Rainbow star", src: "/stickers/rainbow-star.svg" },
    { id: "pizza-party", label: "Pizza party", src: "/stickers/pizza-party.svg" },
    { id: "rocket-hello", label: "Rocket hello", src: "/stickers/rocket-hello.svg" },
];

export const MESSAGE_PICKER_CLASS_NAME = "absolute right-0 bottom-12 z-20 w-72 max-h-60 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-3 shadow-xl";

export const appendEmoteToText = (text, emoteValue) => `${text}${emoteValue}`;

export const getStickerById = (id) => STICKERS.find((sticker) => sticker.id === id);
