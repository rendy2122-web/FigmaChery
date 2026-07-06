"use client";

import { useState } from "react";
import { CalendarCheckIcon } from "lucide-react";

const models = [
  "Chery Q",
  "Tiggo Cross CSH",
  "Tiggo 9 CSH",
  "Chery J6",
  "Chery E5",
  "Chery C5 CSH",
];

const inputClass =
  "h-[52px] w-full rounded-lg border-2 border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-deep focus:outline-none";

interface DealerBookingFormProps {
  dealerName: string;
  whatsapp: string;
}

export function DealerBookingForm({ dealerName, whatsapp }: DealerBookingFormProps) {
  const [program, setProgram] = useState<"pre-booking" | "test-drive">(
    "test-drive"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedProgram = program === "test-drive" ? "Test Drive" : "Pre-Booking";
    const selectedModel = formData.get("model") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `Halo Tim ${dealerName}, saya ${fullName} tertarik untuk ${selectedProgram} ${selectedModel}. Berikut data saya:\n\nNama: ${fullName}\nPhone: +62 ${phone}\nEmail: ${email}${message ? `\nPesan: ${message}` : ""}\n\nMohon informasinya ya. Terima kasih.`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 rounded p-10 lg:p-20"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-h1 font-heading font-bold text-foreground">
          Booking Test Drive & Pre-Booking
        </h2>
        <p className="text-body-lg text-muted-foreground">
          Isi form berikut, tim {dealerName} akan menghubungi Anda via
          WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-foreground/80">
            Pilih Program Yang Di Inginkan *
          </span>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setProgram("pre-booking")}
              aria-pressed={program === "pre-booking"}
              className={
                program === "pre-booking"
                  ? "h-11 flex-1 rounded-full bg-brand-deep text-sm font-bold text-white"
                  : "h-11 flex-1 rounded-full bg-brand-deep/10 text-sm font-bold text-brand-deep"
              }
            >
              Pre-Booking
            </button>
            <button
              type="button"
              onClick={() => setProgram("test-drive")}
              aria-pressed={program === "test-drive"}
              className={
                program === "test-drive"
                  ? "h-11 flex-1 rounded-full bg-brand-deep text-sm font-bold text-white"
                  : "h-11 flex-1 rounded-full bg-brand-deep/10 text-sm font-bold text-brand-deep"
              }
            >
              Test Drive
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="model"
            className="text-sm font-semibold text-foreground/80"
          >
            Mobil *
          </label>
          <select id="model" name="model" required defaultValue="Chery J6" className={inputClass}>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-foreground/80"
          >
            Nama Lengkap *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Tulis Nama Lengkap Anda..."
            className={inputClass}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-foreground/80"
            >
              Phone Number *
            </label>
            <div className="flex h-[52px] overflow-hidden rounded-lg border-2 border-border bg-background focus-within:border-brand-deep">
              <span className="flex items-center border-r-2 border-border px-4 text-sm font-bold text-foreground">
                +62
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="812 3456 7890"
                className="w-full px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-foreground/80"
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Tulis Email Aktif Anda"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="message"
            className="text-sm font-semibold text-foreground/80"
          >
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us more about what you're looking for..."
            className="w-full resize-none rounded-lg border-2 border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-deep focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-brand-deep">
          *Wajib diisi
        </span>
        <button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          <CalendarCheckIcon className="size-5" aria-hidden="true" />
          Siap Untuk{" "}
          {program === "test-drive" ? "Test Drive" : "Pre-Booking"}!
        </button>
      </div>
    </form>
  );
}
