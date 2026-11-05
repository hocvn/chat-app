import { useState, useRef } from "react";

import { Send, Image, X, Smile } from "lucide-react";
import { toast } from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { EMOTES, MESSAGE_PICKER_CLASS_NAME, STICKERS, appendEmoteToText } from "../constants/messageCatalog";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isSendingSticker, setIsSendingSticker] = useState(false);
    const fileInputRef = useRef(null);
    const textInputRef = useRef(null);
    const isSendingStickerRef = useRef(false);
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

    const handleStickerSelect = async (sticker) => {
        if (isSendingStickerRef.current) return;

        isSendingStickerRef.current = true;
        setIsSendingSticker(true);
        setIsPickerOpen(false);

        try {
            await sendMessage({ content: { type: "sticker", value: sticker.id } });
        } catch {
            toast.error("Failed to send sticker");
        } finally {
            isSendingStickerRef.current = false;
            setIsSendingSticker(false);
        }
    };

    const handleEmoteSelect = (emote) => {
        setText((currentText) => appendEmoteToText(currentText, emote.value));
        setIsPickerOpen(false);
        textInputRef.current?.focus();
    };

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
                        ref={textInputRef}
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="relative" onKeyDown={(event) => event.key === "Escape" && setIsPickerOpen(false)}>
                        <button type="button" className="btn btn-circle" aria-label="Open emote and sticker picker" aria-expanded={isPickerOpen} aria-controls="message-content-picker" onClick={() => setIsPickerOpen((open) => !open)}>
                            <Smile size={20} />
                        </button>
                        {isPickerOpen && <div id="message-content-picker" role="region" aria-label="Emote and sticker picker" className={MESSAGE_PICKER_CLASS_NAME}>
                            <p className="mb-2 text-sm font-semibold">Emotes</p>
                            <div className="grid grid-cols-6 gap-1">{EMOTES.map((emote) => <button key={emote.id} type="button" title={emote.label} aria-label={emote.label} className="btn btn-ghost btn-sm text-xl" onClick={() => handleEmoteSelect(emote)}>{emote.value}</button>)}</div>
                            <p className="mb-2 mt-3 text-sm font-semibold">Stickers</p>
                            <div className="grid grid-cols-4 gap-2">{STICKERS.map((sticker) => <button key={sticker.id} type="button" title={sticker.label} aria-label={`Send ${sticker.label}`} className="rounded-lg hover:bg-base-200 disabled:cursor-wait" disabled={isSendingSticker} onClick={() => handleStickerSelect(sticker)}><img src={sticker.src} alt="" className="size-12" /></button>)}</div>
                        </div>}
                    </div>

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
