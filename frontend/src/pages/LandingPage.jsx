import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  Palette,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  ArrowRight,
  Send,
  Smartphone,
  Server,
  Database,
  Lock,
  Activity,
  Heart,
  Smile,
  Layers,
  Check,
  ChevronRight,
  Radio,
} from "lucide-react";

const POPULAR_THEMES = [
  "coffee",
  "synthwave",
  "cyberpunk",
  "luxury",
  "dracula",
  "dark",
  "light",
  "cupcake",
  "emerald",
  "retro",
  "halloween",
  "autumn",
];

const FEATURES = [
  {
    icon: Zap,
    title: "Ultra-Low Latency Messaging",
    description:
      "Powered by Socket.IO bi-directional WebSocket streams. Messages and read statuses sync instantly across all devices without polling.",
    badge: "Real-Time",
  },
  {
    icon: Radio,
    title: "Live Presence & Status",
    description:
      "Accurate real-time online/offline indicators. Know the exact moment your friends and contacts become active or step away.",
    badge: "Instant Sync",
  },
  {
    icon: ImageIcon,
    title: "Rich Media & Image Sharing",
    description:
      "Send high-resolution photos and visual attachments directly in your conversations, backed by Cloudinary's fast CDN delivery.",
    badge: "Cloudinary CDN",
  },
  {
    icon: Palette,
    title: "32 Expressive Themes",
    description:
      "Personalize your entire chat experience with 32 curated DaisyUI themes ranging from Cyberpunk and Synthwave to Coffee and Cupcake.",
    badge: "Customizable",
  },
  {
    icon: Shield,
    title: "Secure JWT Authentication",
    description:
      "Enterprise-grade security using HTTP-Only cookies, salted bcrypt password hashing, and protected route middlewares for absolute peace of mind.",
    badge: "Encrypted",
  },
  {
    icon: Smartphone,
    title: "Responsive & Fluid Design",
    description:
      "Meticulously crafted with Tailwind CSS and modern CSS variables. Enjoy a flawless experience across smartphones, tablets, and desktops.",
    badge: "Cross-Platform",
  },
];

const TECH_STACK = [
  { name: "React 19", role: "UI Framework", category: "Frontend" },
  { name: "Vite 6", role: "Next-Gen Bundler", category: "Frontend" },
  { name: "Tailwind CSS", role: "Utility Styling", category: "Frontend" },
  { name: "DaisyUI 4", role: "Component Library", category: "Frontend" },
  { name: "Zustand", role: "State Management", category: "Frontend" },
  { name: "Socket.IO", role: "WebSocket Engine", category: "Fullstack" },
  { name: "Node.js & Express", role: "RESTful API Server", category: "Backend" },
  { name: "MongoDB & Mongoose", role: "Document Database", category: "Backend" },
  { name: "Cloudinary SDK", role: "Media CDN Storage", category: "Cloud" },
  { name: "JWT & Bcryptjs", role: "Auth & Cryptography", category: "Security" },
];

const FAQS = [
  {
    q: "Is Chattap free to use?",
    a: "Yes! Chattap is 100% free and open-source. You can register an account, customize your profile, and start chatting with contacts immediately.",
  },
  {
    q: "How does real-time communication work?",
    a: "Chattap establishes a full-duplex WebSocket connection via Socket.IO upon authentication. Whenever a message is sent, the server immediately forwards it to the recipient socket without any polling delay.",
  },
  {
    q: "Can I switch themes at any time?",
    a: "Absolutely! Chattap includes 32 built-in themes. You can switch your theme anytime from the Settings page or the interactive theme showcase on this page. Your choice is automatically persisted in your browser.",
  },
  {
    q: "Are uploaded images safe and optimized?",
    a: "Yes. All image attachments and profile avatars are securely uploaded to Cloudinary's global media cloud CDN, which ensures fast delivery, compression, and reliable storage.",
  },
];

const INITIAL_DEMO_MESSAGES = [
  {
    id: 1,
    sender: "Sarah Lin",
    isMe: false,
    text: "Hey! Welcome to Chattap 👋 Have you tried the real-time sync yet?",
    time: "10:24 AM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    sender: "You",
    isMe: true,
    text: "Yes! Socket.IO message delivery is instantaneous 🚀 Zero lag at all.",
    time: "10:25 AM",
    avatar: "/avatar.png",
  },
  {
    id: 3,
    sender: "Sarah Lin",
    isMe: false,
    text: "And check out how clean the media attachments look through Cloudinary:",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    time: "10:26 AM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    sender: "You",
    isMe: true,
    text: "Love it! Plus there are 32 DaisyUI themes to choose from 🎨",
    time: "10:27 AM",
    avatar: "/avatar.png",
  },
];

const LandingPage = () => {
  const { authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [demoMessages, setDemoMessages] = useState(INITIAL_DEMO_MESSAGES);
  const [demoInput, setDemoInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendDemoMessage = (e) => {
    e?.preventDefault();
    if (!demoInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      isMe: true,
      text: demoInput,
      time: "Just now",
      avatar: "/avatar.png",
    };

    setDemoMessages((prev) => [...prev, newMsg]);
    setDemoInput("");

    // Simulate friendly response after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setDemoMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "Sarah Lin",
          isMe: false,
          text: "Awesome message! Sign up now to experience live 1-to-1 chats with friends 🎉",
          time: "Just now",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        },
      ]);
    }, 1200);
  };

  const handleQuickPrompt = (promptText) => {
    setDemoInput(promptText);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden pt-16">
      {/* Background ambient lighting effects */}
      <div className="relative pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-1/4 -z-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-96 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/80 border border-base-300 backdrop-blur-md shadow-sm hover:border-primary/50 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-success animate-ping" />
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium">
              Next-Gen Real-Time Messaging &bull; React 19 + Socket.IO
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Conversations at the <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Speed of Thought
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience lightning-fast 1-to-1 messaging, instant Cloudinary media sharing,
            real-time presence tracking, and 32 customizable themes — built for modern web standards.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {authUser ? (
              <Link
                to="/"
                className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Go to Your Chats</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto"
                >
                  <span>Start Chatting Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg gap-2 w-full sm:w-auto hover:bg-base-200"
                >
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
            <a
              href="#interactive-demo"
              className="btn btn-ghost btn-lg gap-2 w-full sm:w-auto text-base-content/80 hover:text-base-content"
            >
              <Activity className="w-5 h-5 text-secondary" />
              <span>Try Live Demo</span>
            </a>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">&lt;50ms</div>
              <div className="text-xs text-base-content/60 font-medium">Socket Latency</div>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-secondary">32</div>
              <div className="text-xs text-base-content/60 font-medium">Curated Themes</div>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-xs text-base-content/60 font-medium">Real-Time Sync</div>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50 border border-base-300/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-success">Zero</div>
              <div className="text-xs text-base-content/60 font-medium">Polling Overhead</div>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE LIVE CHAT PREVIEW MOCKUP */}
        <div id="interactive-demo" className="mt-14 max-w-4xl mx-auto scroll-mt-24">
          <div className="rounded-2xl border border-base-300 bg-base-100 shadow-2xl shadow-base-content/5 overflow-hidden transition-all">
            {/* Window Top Bar */}
            <div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="ml-2 text-xs font-mono text-base-content/60 hidden sm:inline">
                  chattap.app &bull; Interactive WebSocket Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-sm badge-primary gap-1">
                  <Palette className="w-3 h-3" />
                  <span>Theme: {theme}</span>
                </span>
                <span className="badge badge-sm badge-success gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-content animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* Chat Mock Header */}
            <div className="px-5 py-3.5 bg-base-100 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah Lin"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-base-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sarah Lin</h3>
                  <p className="text-xs text-success flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Online &bull; Available
                  </p>
                </div>
              </div>

              <div className="text-xs text-base-content/60 hidden sm:flex items-center gap-2">
                <span className="badge badge-ghost badge-sm">Direct Message</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto bg-base-200/30">
              {demoMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-base-300"
                  />
                  <div className={`max-w-[80%] sm:max-w-md ${msg.isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.isMe
                          ? "bg-primary text-primary-content rounded-br-none"
                          : "bg-base-100 border border-base-300 text-base-content rounded-bl-none"
                        }`}
                    >
                      {msg.text && <p>{msg.text}</p>}
                      {msg.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-base-300">
                          <img
                            src={msg.image}
                            alt="Shared media"
                            className="w-full max-h-48 object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-[10px] text-base-content/50 ${msg.isMe ? "justify-end" : "justify-start"
                        }`}
                    >
                      <span>{msg.time}</span>
                      {msg.isMe && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-base-content/60 italic pl-10">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300" />
                  </span>
                  <span>Sarah is typing...</span>
                </div>
              )}
            </div>

            {/* Interactive Demo Input */}
            <div className="p-3 sm:p-4 bg-base-100 border-t border-base-300">
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <span className="text-[11px] text-base-content/60 self-center mr-1">Quick try:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("How do I share high-res images? 📸")}
                  className="badge badge-sm badge-outline hover:badge-primary cursor-pointer transition-colors"
                >
                  Image uploads?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("How fast is the WebSocket connection? ⚡")}
                  className="badge badge-sm badge-outline hover:badge-primary cursor-pointer transition-colors"
                >
                  Socket latency?
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("Can I change my avatar in settings? 👤")}
                  className="badge badge-sm badge-outline hover:badge-primary cursor-pointer transition-colors"
                >
                  Avatar support?
                </button>
              </div>

              <form onSubmit={handleSendDemoMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Type a demo message and press Enter..."
                  className="input input-bordered input-sm sm:input-md flex-1 focus:outline-primary"
                />
                <button
                  type="submit"
                  disabled={!demoInput.trim()}
                  className="btn btn-primary btn-sm sm:btn-md gap-1"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES BENTO GRID */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center space-y-4 mb-16">
          <div className="badge badge-primary badge-outline font-semibold gap-1.5 px-3 py-1">
            <Layers className="w-3.5 h-3.5" />
            Built for Modern Communication
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Engineered with Excellence
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
            Every feature in Chattap is crafted to provide a seamless, enjoyable, and responsive
            messaging environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group p-6 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/50 hover:bg-base-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="badge badge-sm badge-ghost font-medium">{feat.badge}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-base-300/60 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span>Explore in Chattap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE THEME SHOWCASE */}
      <section id="themes" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200/40 border-y border-base-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="badge badge-secondary badge-outline font-semibold gap-1.5 px-3 py-1">
              <Palette className="w-3.5 h-3.5" />
              Real-Time Theming
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Express Yourself in 32 Themes
            </h2>
            <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
              Click any theme below to switch the entire application style right now! Themes are
              powered by DaisyUI CSS variables and instantly remembered.
            </p>
          </div>

          {/* Popular Theme Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {POPULAR_THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`group p-3 rounded-xl border text-left transition-all ${theme === t
                    ? "border-primary bg-base-100 shadow-md ring-2 ring-primary/20 scale-[1.02]"
                    : "border-base-300 bg-base-100 hover:border-primary/50 hover:bg-base-100/80"
                  }`}
              >
                {/* Theme Palette Bar */}
                <div
                  className="h-8 w-full rounded-lg overflow-hidden border border-base-300/40 mb-2.5 shadow-sm"
                  data-theme={t}
                >
                  <div className="grid grid-cols-4 h-full">
                    <div className="bg-primary flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary-content">P</span>
                    </div>
                    <div className="bg-secondary flex items-center justify-center">
                      <span className="text-[9px] font-bold text-secondary-content">S</span>
                    </div>
                    <div className="bg-accent flex items-center justify-center">
                      <span className="text-[9px] font-bold text-accent-content">A</span>
                    </div>
                    <div className="bg-neutral flex items-center justify-center">
                      <span className="text-[9px] font-bold text-neutral-content">N</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold capitalize truncate">{t}</span>
                  {theme === t && (
                    <span className="badge badge-primary badge-xs">Active</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/settings"
              className="btn btn-outline btn-sm gap-2 font-medium hover:btn-primary"
            >
              <Palette className="w-4 h-4" />
              <span>Explore All {THEMES.length} Available Themes in Settings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="badge badge-accent badge-outline font-semibold gap-1.5 px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Simple 3-Step Setup
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How Chattap Works
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
            Start having rich real-time conversations in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-content font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-primary/20">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Register quickly with your username, full name, and email. Your credentials are
              safely hashed with bcrypt.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-content font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-secondary/20">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Customize Profile & Theme</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Upload a personalized avatar powered by Cloudinary and pick any of the 32 themes
              that match your mood.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-accent text-accent-content font-bold text-xl flex items-center justify-center mb-6 shadow-md shadow-accent/20">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Start Messaging Instantly</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Connect with registered users, view live online status indicators, and share photos
              in real time with zero delay.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TECH STACK & ARCHITECTURE MATRIX */}
      <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200/30 border-y border-base-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="badge badge-info badge-outline font-semibold gap-1.5 px-3 py-1">
              <Server className="w-3.5 h-3.5" />
              Fullstack Modern Stack
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Powered by Industry Standards
            </h2>
            <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
              Built on a decoupled fullstack monorepo designed for performance, modularity, and
              developer velocity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="badge badge-xs badge-ghost mb-2">{tech.category}</span>
                  <h4 className="font-bold text-sm sm:text-base">{tech.name}</h4>
                </div>
                <p className="text-xs text-base-content/60 mt-1">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/70">
            Everything you need to know about Chattap features and architecture.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="collapse collapse-plus bg-base-200/60 border border-base-300 rounded-xl"
            >
              <input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
              <div className="collapse-title text-base sm:text-lg font-semibold">
                {faq.q}
              </div>
              <div className="collapse-content text-sm text-base-content/75 leading-relaxed">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 sm:p-14 text-primary-content shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Upgrade Your Chat Experience?
            </h2>
            <p className="text-primary-content/85 text-base sm:text-lg leading-relaxed">
              Join Chattap today. Enjoy instant messaging, custom themes, media uploads, and live
              presence with zero setup fuss.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to={authUser ? "/" : "/signup"}
                className="btn btn-neutral btn-lg gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <span>{authUser ? "Open Chat" : "Create Free Account"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/settings"
                className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
              >
                <span>Browse 32 Themes</span>
              </Link>
            </div>
          </div>

          {/* Ambient background decoration circle */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-base-300 bg-base-200/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Chattap Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="font-bold text-lg">Chattap</span>
            </div>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Fullstack real-time messaging with Socket.IO, React 19, DaisyUI, and MongoDB.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home / Chat
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-primary transition-colors">
                  Theme Settings
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-primary transition-colors">
                  Interactive Demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
              Developer & API
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/api/check-health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Health Check Endpoint</span>
                  <Activity className="w-3 h-3 text-success" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/hocvn/chat-app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <span className="text-base-content/50">MIT License</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Chattap. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-error fill-error" /> for real-time web
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
