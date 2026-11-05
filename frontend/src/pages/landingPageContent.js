export const INITIAL_DEMO_MESSAGES = [
  {
    id: 1,
    sender: "Mira",
    isMe: false,
    text: "Are we still on for coffee after class?",
    time: "10:24 AM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    sender: "You",
    isMe: true,
    text: "Absolutely. I can be there around four.",
    time: "10:25 AM",
    avatar: "/avatar.png",
  },
  {
    id: 3,
    sender: "Mira",
    isMe: false,
    text: "Perfect — I’ll save you a seat.",
    time: "10:26 AM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

export const createDemoReply = (id) => ({
  id,
  sender: "Mira",
  isMe: false,
  text: "I’m here — make an account and keep the conversation going.",
  time: "Just now",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
});
