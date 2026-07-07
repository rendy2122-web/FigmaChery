"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Sparkles, Loader2, ArrowUpRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CheryAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya **CHIVA** (Chery Intelligent Virtual Assistant). Ada yang ingin Anda tanyakan mengenai spesifikasi, harga, atau keunggulan teknologi dari mobil Chery? Saya siap membantu Anda mengambil keputusan terbaik."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Notify WhatsApp when our open state changes
    const event = new CustomEvent("chiva-open-state", { detail: { isOpen } });
    window.dispatchEvent(event);
  }, [isOpen]);

  useEffect(() => {
    const handleWhatsappState = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsWhatsappOpen(customEvent.detail.isOpen);
    };

    window.addEventListener("whatsapp-open-state", handleWhatsappState);
    return () => {
      window.removeEventListener("whatsapp-open-state", handleWhatsappState);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const SUGGESTIONS = [
    "Berapa harga OMODA E5?",
    "Bandingkan OMODA E5 & TIGGO 8",
    "Apa kelebihan baterai LFP?",
    "Cara booking Test Drive?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error("Error communicating with chatbot server:", err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Koneksi asisten sedang sibuk. Namun, untuk membantu keputusan Anda secara cepat, berikut lineup mobil Chery ter-update kami:\n\n• **Chery OMODA E5** (EV): Rp 799.9 Juta (Baterai LFP 61 kWh, Jarak tempuh **430 km**)\n• **Chery J6** (EV Off-Road): Rp 739.9 Juta\n• **TIGGO 9 CSH** (Hybrid): Rp 849.9 Juta (Luxury 7-Seater)\n• **OMODA 5 GT** (Petrol): Rp 404.8 Juta (Mesin **1.6L Turbo 197 HP**)\n• **CHERY Q** (EV Hatchback): Rp 329.8 Juta\n\nAnda dapat menguji performa lineup Chery langsung dengan mengklik tombol **Book Test Drive** di bagian atas halaman!"
          }
        ]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className={`fixed z-[10000] font-sans transition-all duration-300 ${
      isWhatsappOpen 
        ? "opacity-0 pointer-events-none scale-95 translate-y-4" 
        : "opacity-100 scale-100 translate-y-0"
    } ${isOpen ? "bottom-6 right-6" : "bottom-24 right-6"}`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-[#DA291C] hover:from-red-500 hover:to-red-600 text-white p-4 rounded-sm shadow-2xl transition-all duration-300 hover:scale-105 group relative"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border border-white rounded-full animate-ping pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border border-white rounded-full text-[9px] font-bold text-white flex items-center justify-center pointer-events-none">1</span>

          <Bot className="w-6 h-6 stroke-[2.2]" />
          <span className="text-xs font-bold uppercase tracking-wider pr-1 hidden md:inline-block">Tanya CHIVA AI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[540px] bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col shadow-2xl relative">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-red-600 to-[#DA291C] flex items-center justify-center shadow-md">
                <Bot className="w-5.5 h-5.5 text-white stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1A1A1A] text-sm">CHIVA AI</span>
                  <span className="inline-flex items-center gap-0.5 bg-red-50 text-[#DA291C] text-[8px] font-bold px-1.5 py-0.5 border border-red-100 rounded-sm uppercase tracking-wider font-mono">
                    <Sparkles className="w-2 h-2" />
                    Expert Consultant
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                  Selalu Aktif
                </span>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-950 p-1.5 hover:bg-slate-100 rounded-sm transition-colors">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] custom-scrollbar bg-slate-50/50">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div key={index} className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-sm bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[#DA291C]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-sm text-xs leading-relaxed font-sans ${isAssistant ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none whitespace-pre-wrap shadow-sm" : "bg-[#DA291C] text-white font-semibold rounded-tr-none shadow-sm"}`}>
                    {msg.content.split("**").map((part, idx) => (idx % 2 === 1 ? <strong key={idx} className={isAssistant ? "text-[#1A1A1A] font-extrabold" : "text-white font-black"}>{part}</strong> : part))}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-sm bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[#DA291C]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-3.5 rounded-sm rounded-tl-none flex items-center gap-1.5 text-slate-400 text-xs shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 text-[#DA291C] animate-spin" />
                  <span>CHIVA sedang mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {SUGGESTIONS.map((suggestion, index) => (
              <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-wide transition-all duration-200 flex items-center gap-1 select-none shrink-0">
                {suggestion}
                <ArrowUpRight className="w-3 h-3 text-[#DA291C]" />
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
            <input type="text" placeholder="Tanyakan spesifikasi, harga, atau ADAS..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-white border border-slate-200 focus:border-[#DA291C] text-xs text-slate-800 px-4 py-3.5 rounded-sm focus:outline-none placeholder-slate-400 font-sans focus:ring-1 focus:ring-[#DA291C]" />
            <button type="submit" disabled={!input.trim()} className="bg-[#DA291C] hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-300 text-white p-3.5 rounded-sm transition-all font-bold shrink-0 shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}