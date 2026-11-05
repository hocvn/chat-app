import mongoose, { mongo } from "mongoose";

const reactionSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true,
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
}, { _id: false });

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["emote", "sticker"],
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
}, { _id: false });

const messageSchema = new mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text : {
        type: String,
    },
    image : {
        type: String
    },
    content: {
        type: contentSchema,
        default: undefined,
    },
    reactions: {
        type: [reactionSchema],
        default: [],
    },
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
