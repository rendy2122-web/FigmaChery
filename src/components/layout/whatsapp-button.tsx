"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XIcon, SendIcon, MessageCircleIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import "./whatsapp-button.css";

type Step = "greeting" | "name" | "phone" | "dealer" | "complete";

interface UserData {
  name: string;
  phone: string;
  dealer: string;
}

const dealers = [
  { name: "Chery Cibubur", phone: "6289527072446" },
  { name: "Chery Makasar", phone: "6289527072446" },
  { name: "Chery Pare-Pare", phone: "6289527072446" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("greeting");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    phone: "",
    dealer: "",
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (step === "name") {
      setUserData((prev) => ({ ...prev, name: inputValue.trim() }));
      setInputValue("");
      setStep("phone");
    } else if (step === "phone") {
      setUserData((prev) => ({ ...prev, phone: inputValue.trim() }));
      setInputValue("");
      setStep("dealer");
    }
  };

  const handleDealerSelect = (dealerName: string, dealerPhone: string) => {
    setUserData((prev) => ({ ...prev, dealer: dealerName }));
    setStep("complete");
  };

  const handleWhatsAppRedirect = () => {
    const selectedDealer = dealers.find((d) => d.name === userData.dealer);
    if (!selectedDealer) return;

    const message = `Halo Tim Chery ${userData.dealer}, saya ${userData.name} tertarik untuk tahu lebih detail tentang produk Chery. Mohon informasinya ya. Terima kasih.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${selectedDealer.phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("greeting");
      setUserData({ name: "", phone: "", dealer: "" });
      setInputValue("");
    }, 300);
  };

  const renderMessage = () => {
    switch (step) {
      case "greeting":
        return `${getGreeting()} 👋 Terima kasih telah menghubungi Chery. Boleh kami tahu nama lengkap Anda?`;
      case "name":
        return "Boleh kami tahu nama lengkap Anda?";
      case "phone":
        return `Terima kasih ${userData.name}. Boleh minta nomor HP aktif Anda?`;
      case "dealer":
        return "Silakan pilih dealer terdekat:";
      case "complete":
        return `Terima kasih ${userData.name}. Klik tombol di bawah untuk melanjutkan ke WhatsApp.`;
      default:
        return "";
    }
  };

  const renderInput = () => {
    if (step === "greeting") {
      return (
        <button onClick={() => setStep("name")} className="start-chat-button">
          Mulai Chat
        </button>
      );
    }

    if (step === "name" || step === "phone") {
      return (
        <div className="chat-input-area">
          <input
            type={step === "phone" ? "tel" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={step === "name" ? "Nama lengkap Anda" : "Nomor HP aktif"}
            className="chat-input"
            autoFocus
          />
          <button onClick={handleSend} className="send-button">
            <SendIcon className="size-5" />
          </button>
        </div>
      );
    }

    if (step === "dealer") {
      return (
        <div className="dealer-buttons">
          {dealers.map((dealer) => (
            <button
              key={dealer.name}
              onClick={() => handleDealerSelect(dealer.name, dealer.phone)}
              className="dealer-button"
            >
              {dealer.name}
            </button>
          ))}
        </div>
      );
    }

    if (step === "complete") {
      return (
        <button onClick={handleWhatsAppRedirect} className="whatsapp-redirect-button">
          <MessageCircleIcon className="size-5" />
          Lanjut ke WhatsApp
        </button>
      );
    }

    return null;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="whatsapp-float-button"
        aria-label="Chat WhatsApp"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={32}
          height={32}
          className="whatsapp-icon"
        />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="whatsapp-popup">
          {/* Header */}
          <div className="whatsapp-header">
            <div className="header-info">
              <div className="avatar">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  width={40}
                  height={40}
                  className="avatar-icon"
                />
              </div>
              <div className="header-text">
                <h3 className="header-title">Chery Indonesia</h3>
                <p className="header-status">Online</p>
              </div>
            </div>
            <button onClick={handleClose} className="close-button">
              <XIcon className="size-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            <div className="message-bubble bot">
              <p>{renderMessage()}</p>
              <span className="message-time">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {renderInput()}
          </div>
        </div>
      )}
    </>
  );
}