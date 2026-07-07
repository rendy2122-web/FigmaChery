"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Sparkles, Loader2, ArrowUpRight, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DealerOption {
  id: string;
  name: string;
  whatsapp: string;
}

type LeadStep = "idle" | "offered" | "name" | "phone" | "dealer" | "done";

const AFFIRMATIVE_WORDS = ["ya", "boleh", "mau", "oke", "ok", "tentu", "iya", "silakan", "lanjut"];
const NEGATIVE_WORDS = ["tidak", "nanti", "gak", "ga", "skip", "belum", "engga", "enggak"];
const CANCEL_WORDS = ["batal", "batalkan", "cancel", "stop"];

export default function CheryAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya **CHIVA** (Chery Intelligent Virtual Assistant). Ada yang ingin Anda tanyakan mengenai spesifikasi, harga, atau keunggulan teknologi dari mobil Chery? Saya siap membantu Anda mengambil keputusan terbaik."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive contact-capture flow (formerly the separate WhatsApp floating
  // widget's greeting -> name -> phone -> dealer flow, now offered by CHIVA
  // itself when a reply signals real buying intent).
  const [leadStep, setLeadStep] = useState<LeadStep>("idle");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [pendingCarInterest, setPendingCarInterest] = useState<string | null>(null);
  const [hasOfferedLead, setHasOfferedLead] = useState(false);
  const [dealers, setDealers] = useState<DealerOption[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<DealerOption | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, leadStep]);

  // Prefetch real dealer data once the flow is close to needing it, rather
  // than on every mount — most visitors never trigger the lead flow at all.
  useEffect(() => {
    if (leadStep === "name" && dealers.length === 0) {
      fetch("/api/dealers")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDealers(data.map((d) => ({ id: d.id, name: d.name, whatsapp: d.whatsapp })));
          }
        })
        .catch(console.error);
    }
  }, [leadStep, dealers.length]);

  const SUGGESTIONS = [
    "Berapa harga OMODA E5?",
    "Bandingkan OMODA E5 & TIGGO 8",
    "Apa kelebihan baterai LFP?",
    "Cara booking Test Drive?"
  ];

  const pushAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  };

  const offerLeadCapture = (carName: string | null) => {
    setPendingCarInterest(carName);
    setHasOfferedLead(true);
    setLeadStep("offered");
    pushAssistantMessage(
      carName
        ? `Ngomong-ngomong, mau saya bantu hubungkan langsung ke tim sales kami soal **${carName}** untuk penawaran & jadwal test drive terbaik? 😊`
        : `Ngomong-ngomong, mau saya bantu hubungkan langsung ke tim sales kami untuk penawaran & jadwal terbaik? 😊`
    );
  };

  const cancelLeadFlow = () => {
    setLeadStep("idle");
    setLeadName("");
    setLeadPhone("");
    setSelectedDealer(null);
    pushAssistantMessage("Baik, tidak masalah! Jangan ragu bertanya lagi ya. 😊");
  };

  const handleDealerSelect = async (dealer: DealerOption) => {
    setSelectedDealer(dealer);
    setLeadStep("done");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          dealerId: dealer.id,
          carInterest: pendingCarInterest,
        }),
      });
    } catch (err) {
      console.error("Error saving lead:", err);
    }

    pushAssistantMessage(
      `Terima kasih **${leadName}**! Tim sales kami dari **${dealer.name}** akan segera menghubungi Anda. Klik tombol di bawah untuk langsung chat via WhatsApp sekarang.`
    );
  };

  const handleWhatsAppRedirect = () => {
    if (!selectedDealer) return;
    const carLine = pendingCarInterest ? ` mengenai ${pendingCarInterest}` : "";
    const message = `Halo Tim ${selectedDealer.name}, saya ${leadName} tertarik untuk tahu lebih detail${carLine}. Mohon informasinya ya. Terima kasih.`;
    const whatsappUrl = `https://wa.me/${selectedDealer.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const lower = textToSend.trim().toLowerCase();

    // Escape hatch — bail out of the contact flow at any step.
    if (leadStep !== "idle" && leadStep !== "done" && CANCEL_WORDS.some((w) => lower === w)) {
      cancelLeadFlow();
      return;
    }

    if (leadStep === "offered") {
      if (AFFIRMATIVE_WORDS.some((w) => lower === w || lower.startsWith(w + " "))) {
        setLeadStep("name");
        pushAssistantMessage("Boleh saya tahu nama lengkap Anda?");
      } else if (NEGATIVE_WORDS.some((w) => lower === w || lower.startsWith(w + " "))) {
        cancelLeadFlow();
      } else {
        // Ambiguous reply — treat the offer as declined and answer their new question normally.
        setLeadStep("idle");
        await askChiva(textToSend);
      }
      return;
    }

    if (leadStep === "name") {
      setLeadName(textToSend.trim());
      setLeadStep("phone");
      pushAssistantMessage(`Terima kasih ${textToSend.trim()}! Boleh minta nomor WhatsApp aktif Anda?`);
      return;
    }

    if (leadStep === "phone") {
      const digits = textToSend.replace(/[^0-9]/g, "");
      if (digits.length < 8) {
        pushAssistantMessage("Sepertinya nomor tersebut belum valid. Boleh masukkan nomor WhatsApp aktif Anda (minimal 8 digit)?");
        return;
      }
      setLeadPhone(textToSend.trim());
      setLeadStep("dealer");
      pushAssistantMessage("Dealer mana yang paling dekat atau Anda inginkan?");
      return;
    }

    if (leadStep === "dealer") {
      const matched = dealers.find((d) => lower.includes(d.name.toLowerCase()));
      if (matched) {
        await handleDealerSelect(matched);
      } else {
        pushAssistantMessage("Silakan pilih salah satu dealer dari tombol di atas ya.");
      }
      return;
    }

    // Normal idle chat
    await askChiva(textToSend);
  };

  const askChiva = async (textToSend: string) => {
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: textToSend }]
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();

      pushAssistantMessage(data.content);

      if (data.suggestLead && !hasOfferedLead) {
        setTimeout(() => offerLeadCapture(data.carInterest || null), 500);
      }
    } catch (err) {
      console.error("Error communicating with chatbot server:", err);
      setTimeout(() => {
        pushAssistantMessage(
          "Koneksi asisten sedang sibuk. Namun, untuk membantu keputusan Anda secara cepat, berikut lineup mobil Chery ter-update kami:\n\n• **Chery OMODA E5** (EV): Rp 799.9 Juta (Baterai LFP 61 kWh, Jarak tempuh **430 km**)\n• **Chery J6** (EV Off-Road): Rp 739.9 Juta\n• **TIGGO 9 CSH** (Hybrid): Rp 849.9 Juta (Luxury 7-Seater)\n• **OMODA 5 GT** (Petrol): Rp 404.8 Juta (Mesin **1.6L Turbo 197 HP**)\n• **CHERY Q** (EV Hatchback): Rp 329.8 Juta\n\nAnda dapat menguji performa lineup Chery langsung dengan mengklik tombol **Book Test Drive** di bagian atas halaman!"
        );
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className={`fixed z-[10000] font-sans transition-all duration-300 opacity-100 scale-100 translate-y-0 ${
      isOpen ? "bottom-6 right-6" : "bottom-24 right-6"
    }`}>
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

          {/* Contact-capture action area — swaps in based on where the lead flow is */}
          {leadStep === "offered" && (
            <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex gap-2">
              <button onClick={() => handleSendMessage("Ya")} className="flex-1 bg-[#DA291C] hover:bg-red-700 text-white text-[11px] font-bold px-3 py-2 rounded-sm transition-colors">
                Ya, bantu saya
              </button>
              <button onClick={() => handleSendMessage("Tidak")} className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold px-3 py-2 rounded-sm transition-colors">
                Nanti dulu
              </button>
            </div>
          )}

          {leadStep === "dealer" && (
            <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-2">
              {dealers.map((dealer) => (
                <button
                  key={dealer.id}
                  onClick={() => handleDealerSelect(dealer)}
                  className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-[#DA291C] px-3 py-1.5 rounded-sm text-[10px] font-bold transition-colors"
                >
                  {dealer.name}
                </button>
              ))}
              <button onClick={cancelLeadFlow} className="text-slate-400 hover:text-slate-600 px-2 py-1.5 text-[10px] font-bold">
                Batal
              </button>
            </div>
          )}

          {(leadStep === "name" || leadStep === "phone") && (
            <div className="px-5 py-2 bg-white border-t border-slate-100 flex justify-end">
              <button onClick={cancelLeadFlow} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold">
                Batal
              </button>
            </div>
          )}

          {leadStep === "done" && selectedDealer && (
            <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex gap-2">
              <button onClick={handleWhatsAppRedirect} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-2.5 rounded-sm transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                Lanjut ke WhatsApp
              </button>
              <button onClick={() => setLeadStep("idle")} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold px-2">
                Tutup
              </button>
            </div>
          )}

          {leadStep === "idle" && (
            <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
              {SUGGESTIONS.map((suggestion, index) => (
                <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-wide transition-all duration-200 flex items-center gap-1 select-none shrink-0">
                  {suggestion}
                  <ArrowUpRight className="w-3 h-3 text-[#DA291C]" />
                </button>
              ))}
            </div>
          )}

          {leadStep !== "dealer" && leadStep !== "done" && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type={leadStep === "phone" ? "tel" : "text"}
                placeholder={
                  leadStep === "name" ? "Nama lengkap Anda" :
                  leadStep === "phone" ? "Nomor WhatsApp aktif" :
                  "Tanyakan spesifikasi, harga, atau ADAS..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 focus:border-[#DA291C] text-xs text-slate-800 px-4 py-3.5 rounded-sm focus:outline-none placeholder-slate-400 font-sans focus:ring-1 focus:ring-[#DA291C]"
                autoFocus={leadStep === "name" || leadStep === "phone"}
              />
              <button type="submit" disabled={!input.trim()} className="bg-[#DA291C] hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-300 text-white p-3.5 rounded-sm transition-all font-bold shrink-0 shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
