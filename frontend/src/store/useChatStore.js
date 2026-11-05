import { create } from 'zustand';
import toast from 'react-hot-toast'; 
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { isMessageInConversation, replaceMessage } from '../constants/messageCatalog';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async() => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
            set({ isUserLoading: false });
        } catch (error) {
            toast.error('Failed to fetch users');
            console.log(error);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async(userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error('Failed to fetch messages');
            console.log(error);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async(messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.log(error);
            throw error;
        }   
    },

    toggleReaction: async(messageId, emoji) => {
        try {
            const res = await axiosInstance.post(`/messages/${messageId}/reactions`, { emoji });
            set({ messages: replaceMessage(get().messages, res.data) });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    subcribeToMessages:() => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return; // Only show messages from selected user
            
            set({ messages: [...get().messages, newMessage] });
        })

        socket.on('messageReactionUpdated', (updatedMessage) => {
            const { selectedUser, messages } = get();
            const { authUser } = useAuthStore.getState();
            if (!selectedUser || !authUser || !isMessageInConversation(updatedMessage, authUser._id, selectedUser._id)) return;

            set({ messages: replaceMessage(messages, updatedMessage) });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
        socket.off('messageReactionUpdated');
    },
    
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
