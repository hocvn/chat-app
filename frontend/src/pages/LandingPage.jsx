import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Palette, Send, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { INITIAL_DEMO_MESSAGES, createDemoReply } from "./landingPageContent";

const POPULAR_THEMES = ["light", "coffee", "emerald", "retro", "dark", "dracula", "cupcake", "autumn"];

const LandingPage = () => {
  const { authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [demoMessages, setDemoMessages] = useState(INITIAL_DEMO_MESSAGES);
  const [demoInput, setDemoInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendDemoMessage = (event) => {
    event.preventDefault();
    const text = demoInput.trim();
    if (!text) return;
    setDemoMessages((messages) => [...messages, { id: Date.now(), sender: "You", isMe: true, text, time: "Just now", avatar: "/avatar.png" }]);
    setDemoInput("");
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setDemoMessages((messages) => [...messages, createDemoReply(Date.now())]);
    }, 900);
  };

  const primaryLink = authUser ? "/" : "/signup";
  const primaryLabel = authUser ? "Open your chats" : "Make an account";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f1eadf] pt-16 text-[#172620] selection:bg-[#d94c35] selection:text-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <h1 className="max-w-lg text-5xl font-black leading-[.88] tracking-[-.04em] text-[#172620] sm:text-7xl">Make time for each other.</h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#385147]">A real-time home for the people you mean to reach. Chattap keeps one-to-one conversations live, personal, and close at hand.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={primaryLink} className="inline-flex min-h-12 items-center gap-2 bg-[#d94c35] px-5 font-bold text-white transition-colors hover:bg-[#b93c2a] focus:outline-none focus:ring-4 focus:ring-[#d94c35]/30">{primaryLabel}<ArrowRight className="size-4" /></Link>
            {!authUser && <Link to="/login" className="inline-flex min-h-12 items-center px-4 font-semibold underline decoration-1 underline-offset-4 hover:text-[#d94c35] focus:outline-none focus:ring-4 focus:ring-[#d94c35]/30">Sign in</Link>}
          </div>
        </div>
        <div className="rotate-1 border border-[#172620] bg-[#fffdf8] p-4 shadow-[12px_18px_35px_rgba(23,38,32,.15)] sm:p-6">
          <div className="flex items-center justify-between border-b border-[#d8cfc0] pb-4">
            <div className="flex items-center gap-3"><img src={INITIAL_DEMO_MESSAGES[0].avatar} alt="Mira" className="size-11 rounded-full object-cover" /><div><p className="font-bold">Mira</p><p className="text-sm text-[#537064]">Here now</p></div></div>
            <span className="size-3 rounded-full bg-[#d94c35]" aria-label="Mira is online" />
          </div>
          <div className="space-y-4 py-7 text-sm"><p className="max-w-[75%] bg-[#e7ddd0] p-3">Are we still on for coffee after class?</p><p className="ml-auto max-w-[75%] bg-[#1e4f45] p-3 text-white">Absolutely. I can be there around four.</p><p className="max-w-[75%] bg-[#e7ddd0] p-3">Perfect — I’ll save you a seat.</p></div>
          <p className="border-t border-[#d8cfc0] pt-4 text-xs font-bold uppercase tracking-[.16em] text-[#537064]">A small conversation, right on time.</p>
        </div>
      </section>

      <section id="interactive-demo" className="bg-[#1e4f45] px-5 py-16 text-[#fff9f0] sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div><h2 className="text-4xl font-black leading-none tracking-[-.04em] sm:text-6xl">Say the thing before it slips away.</h2><p className="mt-6 max-w-sm leading-relaxed text-[#d8e5dc]">Try the conversation. Your message stays in this demo; a real account is where the thread continues.</p></div>
          <div className="bg-[#fffdf8] p-4 text-[#172620] shadow-[10px_14px_30px_rgba(0,0,0,.18)] sm:p-6">
            <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
              {demoMessages.map((message) => <div key={message.id} className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}><img src={message.avatar} alt="" className="size-8 rounded-full object-cover" /><div className={`max-w-[75%] p-3 text-sm ${message.isMe ? "bg-[#d94c35] text-white" : "bg-[#ece4d8]"}`}><p>{message.text}</p><time className="mt-1 block text-[10px] opacity-70">{message.time}</time></div></div>)}
              {isTyping && <p className="text-sm text-[#537064]">Mira is typing…</p>}
            </div>
            <form onSubmit={sendDemoMessage} className="mt-5 flex gap-2 border-t border-[#d8cfc0] pt-4"><input value={demoInput} onChange={(event) => setDemoInput(event.target.value)} className="min-w-0 flex-1 border border-[#9eb2a7] bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#d94c35]" placeholder="Write back to Mira" aria-label="Demo message" /><button type="submit" disabled={!demoInput.trim()} className="inline-flex items-center gap-2 bg-[#d94c35] px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" /><span className="hidden sm:inline">Send</span></button></form>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-px overflow-hidden border border-[#cfc3b2] bg-[#cfc3b2] md:grid-cols-3">
          <article className="bg-[#f1eadf] p-7"><Users className="size-6 text-[#d94c35]" /><h2 className="mt-12 text-3xl font-black tracking-[-.04em]">See who’s around.</h2><p className="mt-4 leading-relaxed text-[#385147]">Live presence makes it easier to start when the moment is right.</p></article>
          <article className="bg-[#f7f2e9] p-7"><ImageIcon className="size-6 text-[#d94c35]" /><h2 className="mt-12 text-3xl font-black tracking-[-.04em]">Keep the good bits.</h2><p className="mt-4 leading-relaxed text-[#385147]">Share a photo directly in the conversation, without breaking the thread.</p></article>
          <article className="bg-[#eee5d7] p-7"><Palette className="size-6 text-[#d94c35]" /><h2 className="mt-12 text-3xl font-black tracking-[-.04em]">Make it yours.</h2><p className="mt-4 leading-relaxed text-[#385147]">Choose a theme that feels like yours, then let it follow you around the app.</p></article>
        </div>
      </section>

      <section id="themes" className="border-y border-[#172620] bg-[#d94c35] px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><h2 className="text-4xl font-black leading-none tracking-[-.04em] sm:text-5xl">The room can change with your mood.</h2><p className="mt-5 text-lg text-white/85">Pick a theme and see it take effect immediately.</p></div><div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">{POPULAR_THEMES.map((item) => <button key={item} type="button" onClick={() => setTheme(item)} className={`min-h-24 border p-4 text-left font-bold capitalize transition-colors focus:outline-none focus:ring-4 focus:ring-white/50 ${theme === item ? "border-white bg-white text-[#172620]" : "border-white/50 hover:bg-white/15"}`}><span data-theme={item} className="mb-4 block h-3 w-full bg-primary" />{item}</button>)}</div><Link to="/settings" className="mt-7 inline-block font-semibold underline underline-offset-4">See all {THEMES.length} themes</Link></div></section>

      <section className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-end lg:py-24"><div><h2 className="max-w-xl text-4xl font-black leading-none tracking-[-.04em] sm:text-6xl">Your next conversation is already waiting.</h2><p className="mt-6 max-w-md text-lg leading-relaxed text-[#385147]">Create an account, find your people, and keep the thread moving.</p></div><Link to={primaryLink} className="inline-flex min-h-14 items-center gap-3 bg-[#172620] px-6 font-bold text-white hover:bg-[#2b443a] focus:outline-none focus:ring-4 focus:ring-[#d94c35]/30">{primaryLabel}<ArrowRight className="size-5" /></Link></section>

      <footer className="border-t border-[#cfc3b2] px-5 py-8 text-sm text-[#537064] sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><span className="font-bold text-[#172620]">Chattap</span><div className="flex gap-5"><a href="/api/check-health" target="_blank" rel="noreferrer" className="hover:text-[#d94c35]">Health</a><Link to="/login" className="hover:text-[#d94c35]">Sign in</Link><Link to="/signup" className="hover:text-[#d94c35]">Create account</Link></div></div></footer>
    </main>
  );
};

export default LandingPage;
