"use client";

import { useState } from "react";
import { X, Calendar, Clock, User, Mail, Phone, MapPin, Loader2, Check, ShieldCheck, Ticket } from "lucide-react";

interface CarData {
  id: string;
  name: string;
  basePrice?: string;
}

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  carModel: string;
  preferredDate: string;
  preferredTime: string;
  testDriveRequired: boolean;
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: "test" | "prebook";
  cars: CarData[];
  activeCar: CarData;
}

export default function BookingForm({ isOpen, onClose, type, cars, activeCar }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>(() => ({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    carModel: activeCar.id,
    preferredDate: "",
    preferredTime: "09:00 - 12:00",
    testDriveRequired: type === "test"
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      const modelCode = type === "test" ? "EV" : "ICE";
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setTicketId(`CHY-${modelCode}-${randomNum}`);
    }, 1800);
  };

  const selectedCar = cars.find((m) => m.id === formData.carModel) || activeCar;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-sm overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 p-2 rounded-sm transition-all hover:scale-105 z-10">
          <X className="w-4 h-4" />
        </button>

        {isLoading ? (
          <div className="py-24 px-8 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#DA291C] animate-spin" />
            <h3 className="text-lg font-bold text-[#1A1A1A] font-sans">Memproses Pengajuan Anda</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">Kami sedang mendaftarkan jadwal Anda ke jaringan dealer Chery Indonesia terdekat...</p>
          </div>
        ) : isSuccess ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] font-sans">{type === "test" ? "Uji Kendara Terjadwal!" : "Pre-Booking Berhasil!"}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Terima kasih, **{formData.fullName}**. Pengajuan Anda telah berhasil didaftarkan secara prioritas di sistem Chery Indonesia.</p>
            </div>

            <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-sm p-5 text-left font-sans space-y-3 relative">
              <div className="absolute -top-3.5 right-4 bg-[#DA291C] text-white text-[9px] font-bold py-1 px-3 rounded-sm uppercase tracking-wider flex items-center gap-1 font-mono shadow-sm">
                <Ticket className="w-3 h-3" /> Ticket Resmi
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Kode Reservasi</span>
                  <span className="font-mono font-bold text-[#DA291C] text-base">{ticketId}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Model Kendaraan</span>
                  <span className="font-bold text-[#1A1A1A] text-xs">{selectedCar.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase">Nama Pendaftar</span>
                  <span className="font-semibold text-slate-700 block truncate">{formData.fullName}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase">Kontak</span>
                  <span className="font-semibold text-slate-700 block">{formData.phone}</span>
                </div>
                {type === "test" && (
                  <>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">Tanggal</span>
                      <span className="font-semibold text-slate-700 block">{formData.preferredDate}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">Waktu</span>
                      <span className="font-semibold text-slate-700 block">{formData.preferredTime}</span>
                    </div>
                  </>
                )}
                {type === "prebook" && (
                  <div className="col-span-2">
                    <span className="block text-[9px] text-slate-400 uppercase">Biaya Booking</span>
                    <span className="font-bold text-emerald-600 block">Rp 5.000.000 (Refundable)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-100 border border-slate-200 p-4 rounded-sm text-xs text-slate-600 max-w-md leading-relaxed flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#DA291C] shrink-0" />
              <span>Konsultan Sales Chery kami akan menghubungi Anda dalam waktu 15 menit melalui WhatsApp untuk melakukan verifikasi jadwal dan mengirimkan petunjuk pembayaran / penjemputan.</span>
            </div>

            <button onClick={onClose} className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-950 font-bold px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-colors">
              Tutup Jendela
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] text-[#DA291C] uppercase font-mono font-bold tracking-widest block mb-1">{type === "test" ? "Sistem Reservasi Uji Kendara" : "Prioritas Pre-Booking Unit"}</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">{type === "test" ? "Formulir Booking Test Drive" : "Formulir Booking Order Chery"}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{type === "test" ? "Rasakan kenyamanan, performa, dan kecanggihan teknologi mengemudi aslinya secara gratis langsung di rumah Anda atau dealer terdekat." : "Amankan antrean produksi Anda untuk OMODA & TIGGO terbaru. Biaya booking Rp 5 Juta dapat di-refund penuh jika terjadi pembatalan."}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Model Mobil Pilihan</label>
                <select name="carModel" value={formData.carModel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans">
                  {cars.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                    <input type="text" name="fullName" required placeholder="Masukkan nama lengkap" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                    <input type="tel" name="phone" required placeholder="Contoh: 08123456789" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                    <input type="email" name="email" required placeholder="nama@email.com" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kota Domisili</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                    <input type="text" name="city" required placeholder="Contoh: Jakarta Barat" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans" />
                  </div>
                </div>
              </div>

              {type === "test" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-150 pt-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Tanggal</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                      <input type="date" name="preferredDate" required value={formData.preferredDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Sesi Waktu</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                      <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] font-sans cursor-pointer">
                        <option value="09:00 - 12:00">Pagi (09:00 - 12:00)</option>
                        <option value="12:00 - 15:00">Siang (12:00 - 15:00)</option>
                        <option value="15:00 - 18:00">Sore (15:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {type === "prebook" && (
                <div className="p-4.5 bg-red-50 border border-red-100 rounded-sm flex flex-col gap-2 font-sans">
                  <span className="text-xs font-extrabold text-[#DA291C] flex items-center gap-1.5 uppercase font-mono">
                    <ShieldCheck className="w-4 h-4" /> Manfaat Pre-Booking Prioritas:
                  </span>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 leading-relaxed pl-1 font-medium">
                    <li>Garansi prioritas antrean unit dan alokasi VIN 2026 tercepat.</li>
                    <li>Gratis biaya pemasangan Home Charger 7kW + Garansi (khusus OMODA E5).</li>
                    <li>Gratis asuransi all-risk tahun pertama untuk pemesanan hari ini.</li>
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#DA291C] hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-sm text-xs uppercase tracking-wider transition-all duration-300 shadow-sm shadow-[#DA291C]/15">
              {type === "test" ? "Kirim Permohonan Test Drive" : "Lanjutkan Pre-Booking (Rp 5.000.000)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}