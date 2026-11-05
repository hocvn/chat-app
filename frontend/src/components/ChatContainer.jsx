import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Smile } from 'lucide-react';

import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';

import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatDateTime } from '../lib/utils';
import { getReactionButtonPosition, getStickerById, hasReacted, REACTION_EMOTES } from '../constants/messageCatalog';

const ChatContainer = () => {
    const { messages, getMessages, isMessageLoading, selectedUser, subcribeToMessages, toggleReaction, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);
    const [reactionPickerMessageId, setReactionPickerMessageId] = useState(null);

    const handleReaction = async (messageId, emoji) => {
        try {
            await toggleReaction(messageId, emoji);
        } catch {
            toast.error("Failed to update reaction");
        } finally {
            setReactionPickerMessageId(null);
        }
    };
    
    useEffect(() => {
        getMessages(selectedUser._id)
        subcribeToMessages()

        return () => {
            unsubscribeFromMessages()
        }
    }, [selectedUser._id, getMessages, subcribeToMessages, unsubscribeFromMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }, 500); // Scroll to the end of the chat when new message is added
        }
    }, [messages])

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        ) 
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div 
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`} 
                        ref={messageEndRef}   // Scroll to the end of the chat when new message is added
                    > 
                        {/* Avatar */}
                        <div className="chat-image avatar">
                            <div className='size-10 rounded-full border-rounded'>
                                <img 
                                    src={message.senderId === authUser._id ? 
                                        authUser.profilePic || "./avatar.png" : selectedUser.profilePic || "./avatar.png"}
                                    alt="profile pic"
                                ></img>
                            </div>
                        </div>

                        {/* Message time */}
                        <div className="chat-header mb-1">
                            <time className="text=xs opacity-60 ml-1">
                                {formatDateTime(message.createdAt)}
                            </time>
                        </div>
                        
                        {/* Message content */}
                        <div className="chat-bubble group relative flex flex-col">
                            {message.image && (
                                <img 
                                    src={message.image}
                                    alt="attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                    onLoad={() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                            {message.content?.type === "emote" && <p className="text-3xl" aria-label="Emote">{message.content.value}</p>}
                            {message.content?.type === "sticker" && getStickerById(message.content.value) && (
                                <img src={getStickerById(message.content.value).src} alt={getStickerById(message.content.value).label} width="160" height="160" className="w-32" />
                            )}
                            <div className={`absolute top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${getReactionButtonPosition(message.senderId === authUser._id)}`}>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs btn-circle border border-base-300 bg-base-100 shadow-sm"
                                        aria-label="Add reaction"
                                        aria-expanded={reactionPickerMessageId === message._id}
                                        title="Add reaction"
                                        onClick={() => setReactionPickerMessageId((currentId) => currentId === message._id ? null : message._id)}
                                    >
                                        <Smile size={16} aria-hidden="true" />
                                    </button>
                                    {reactionPickerMessageId === message._id && (
                                        <div className={`absolute bottom-full z-10 mb-2 flex gap-1 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg ${message.senderId === authUser._id ? "right-0" : "left-0"}`}>
                                            {REACTION_EMOTES.filter(({ value }) => !message.reactions?.some((reaction) => reaction.emoji === value)).map((reaction) => (
                                                <button
                                                    key={reaction.value}
                                                    type="button"
                                                    className="btn btn-ghost btn-sm"
                                                    aria-label={`React with ${reaction.label}`}
                                                    onClick={() => handleReaction(message._id, reaction.value)}
                                                >
                                                    {reaction.value}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="chat-footer relative mt-1 flex flex-wrap items-center gap-1">
                            {message.reactions?.map((reaction) => (
                                <button
                                    key={reaction.emoji}
                                    type="button"
                                    className={`btn btn-xs gap-1 rounded-full ${hasReacted(reaction, authUser._id) ? "btn-primary" : "btn-ghost border border-base-300"}`}
                                    aria-label={`${reaction.emoji} reaction, ${reaction.userIds.length} ${reaction.userIds.length === 1 ? "person" : "people"}`}
                                    aria-pressed={hasReacted(reaction, authUser._id)}
                                    onClick={() => handleReaction(message._id, reaction.emoji)}
                                >
                                    <span>{reaction.emoji}</span>
                                    <span>{reaction.userIds.length}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef}/>
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer;
