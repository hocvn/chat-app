import { create } from 'zustand';
import toast from 'react-hot-toast'; 
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { applyPendingReactionUpdates, isMessageInConversation, replaceMessageIfNewer } from '../constants/messageCatalog';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    pendingReactionUpdates: {},

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
            set((state) => {
                const pendingReactionUpdates = { ...state.pendingReactionUpdates };
                res.data.forEach((message) => delete pendingReactionUpdates[message._id]);

                return {
                    messages: applyPendingReactionUpdates(res.data, state.pendingReactionUpdates),
                    pendingReactionUpdates,
                };
            });
        } catch (error) {
            toast.error('Failed to fetch messages');
            console.log(error);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async(messageData) => {
        const { selectedUser } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set((state) => ({ messages: [...state.messages, res.data] }));
        } catch (error) {
            console.log(error);
            throw error;
        }   
    },

    toggleReaction: async(messageId, emoji) => {
        try {
            const res = await axiosInstance.post(`/messages/${messageId}/reactions`, { emoji });
            set((state) => ({ messages: replaceMessageIfNewer(state.messages, res.data) }));
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
            const { selectedUser } = get();
            const { authUser } = useAuthStore.getState();
            if (!selectedUser || !authUser || !isMessageInConversation(updatedMessage, authUser._id, selectedUser._id)) return;

            set((state) => {
                const messageExists = state.messages.some((message) => message._id === updatedMessage._id);
                return {
                    messages: replaceMessageIfNewer(state.messages, updatedMessage),
                    pendingReactionUpdates: messageExists
                        ? state.pendingReactionUpdates
                        : { ...state.pendingReactionUpdates, [updatedMessage._id]: updatedMessage },
                };
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
        socket.off('messageReactionUpdated');
    },
    
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
