import { useState, useRef } from "react";

import { Send, Image, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            return toast.error("Please select an image file");
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large. Max size is 1MB")
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);
        fileInputRef.current.value = "";
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({ 
                text: text.trim(), 
                image: imagePreview 
            });
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.log("Failed to send message", error);
            toast.error("Failed to send message");
        }
    }

    return (
        <div className="w-full p-4">
            {/* Image preview */}
            { imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                            flex items-center justify-center"
                            type="button"
                        >
                        <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Message content */}
                <div className="flex-1 flex gap-2">
                    {/* Text input */}
                    <input
                        type="text"
                        placeholder="Message"
                        value={text}
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Image input */}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    /> 

                    {/* Image button */}
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    className="btn sm:flex btn-circle"
                    disabled={!text.trim() && !imagePreview}
                    >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput;