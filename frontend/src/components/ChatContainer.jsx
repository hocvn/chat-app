import React, { useEffect } from 'react';

import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';

import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatDateTime } from '../lib/utils';

const ChatContainer = () => {
    const { messages, getMessages, isMessageLoading, selectedUser } = useChatStore();
    const { authUser } = useAuthStore();
    
    useEffect(() => {
        getMessages(selectedUser._id)
    }, [selectedUser._id, getMessages])

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        ) 
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div 
                            key={message._id}
                            className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`} 
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
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img 
                                        src={message.image}
                                        alt="attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer;