import mongoose, { mongo } from "mongoose";

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
        type: {
            type: String,
            enum: ["emote", "sticker"]
        },
        value: {
            type: String,
            required: function () {
                return Boolean(this.content?.type);
            }
        }
    },
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
