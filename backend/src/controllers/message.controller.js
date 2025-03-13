import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

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
        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            // Upload to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        });

        if (!text && !imageUrl) {
            return res.status(400).json({ message: 'Text or image is required' });
        }

        if (!newMessage) {
            return res.status(400).json({ message: 'Message not created' });
        }

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