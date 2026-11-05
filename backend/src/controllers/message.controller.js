import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, getReceiverSocketIds, io } from '../lib/socket.js';
import { hasInvalidSuppliedContent, hasMessageBody } from '../lib/message-content.js';
import { isValidReactionEmoji, toggleReaction } from '../lib/message-reactions.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password');
        res.status(200).json(filterUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id : receiverId } = req.params;
        
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image, content } = req.body;

        if (hasInvalidSuppliedContent(req.body) || !hasMessageBody({ text, image, content })) {
            return res.status(400).json({ message: "A message must include text, an image, or valid content" });
        }

        let imageUrl;
        if (image) {
            // Upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl,
            content: content || undefined
        });

        await newMessage.save();

        // Send notification to receiver if online
        const receiverSocketId = getReceiverSocketId(receiverId); 
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const createToggleMessageReaction = ({ findMessageById, getReceiverSocketId, getReceiverSocketIds, io }) => async (req, res) => {
    try {
        const { emoji } = req.body;
        if (!isValidReactionEmoji(emoji)) {
            return res.status(400).json({ message: "Unsupported reaction emoji" });
        }

        const userId = req.user._id.toString();
        let message;
        let senderId;
        let receiverId;

        for (let attempt = 0; attempt < 3; attempt += 1) {
            message = await findMessageById(req.params.id);
            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }

            senderId = message.senderId.toString();
            receiverId = message.receiverId.toString();
            if (userId !== senderId && userId !== receiverId) {
                return res.status(403).json({ message: "You cannot react to this message" });
            }

            message.reactions = toggleReaction(message.reactions || [], emoji, userId);
            try {
                await message.save();
                break;
            } catch (error) {
                if (error.name !== "VersionError" || attempt === 2) throw error;
            }
        }

        const socketIdsForUser = getReceiverSocketIds || ((participantId) => [getReceiverSocketId(participantId)]);
        const participantSocketIds = new Set([
            ...socketIdsForUser(senderId),
            ...socketIdsForUser(receiverId),
        ].filter(Boolean));

        participantSocketIds.forEach((socketId) => {
            io.to(socketId).emit('messageReactionUpdated', message);
        });

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in toggleMessageReaction controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const toggleMessageReaction = createToggleMessageReaction({
    findMessageById: Message.findById.bind(Message),
    getReceiverSocketId,
    getReceiverSocketIds,
    io,
});
