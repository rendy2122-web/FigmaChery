"use client";

import { useState } from "react";
import { Star, ThumbsUp, CheckCircle, PenTool, MessageSquare, Check } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  carModel: string | null;
  verified: boolean;
  likes: number;
}

interface TestimonialRow {
  id: string;
  car_id: string | null;
  author_name: string;
  rating: number;
  comment: string;
  verified: number;
  likes: number;
  created_at: string;
}

interface CarData {
  id: string;
  name: string;
}

interface CustomerReviewsProps {
  car: CarData;
  allCars: CarData[];
  initialTestimonials?: TestimonialRow[];
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "Hari Ini";
  if (days < 7) return `${days} hari yang lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu yang lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan yang lalu`;
  return `${Math.floor(days / 365)} tahun yang lalu`;
}

function toReview(row: TestimonialRow): Review {
  return {
    id: row.id,
    name: row.author_name,
    rating: row.rating,
    date: formatRelativeDate(row.created_at),
    comment: row.comment,
    carModel: row.car_id,
    verified: Boolean(row.verified),
    likes: row.likes,
  };
}

export default function CustomerReviews({ car, allCars, initialTestimonials = [] }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialTestimonials.map(toReview));
  const [filterModel, setFilterModel] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    carModel: car.id,
    comment: ""
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleLike = async (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r)));
    try {
      await fetch(`/api/testimonials/${id}/like`, { method: "POST" });
    } catch {
      // best-effort — local optimistic update already applied
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: newReview.carModel,
          authorName: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Gagal mengirim ulasan. Silakan coba lagi.");
        return;
      }

      const { id } = await res.json();

      setReviews((prev) => [
        {
          id,
          name: newReview.name,
          rating: newReview.rating,
          date: "Hari Ini",
          comment: newReview.comment,
          carModel: newReview.carModel,
          verified: false,
          likes: 0,
        },
        ...prev,
      ]);

      setSubmitSuccess(true);
      setNewReview({ name: "", rating: 5, carModel: car.id, comment: "" });

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
      }, 2500);
    } catch {
      setSubmitError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterModel === "all") return true;
    return r.carModel === filterModel;
  });

  const averageRating = (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / (filteredReviews.length || 1)).toFixed(1);

  const totalCount = filteredReviews.length || 1;
  const countStars = (stars: number) => {
    return filteredReviews.filter((r) => r.rating === stars).length;
  };

  const getCarTitle = (id: string | null) => {
    const found = allCars.find((c) => c.id === id);
    return found?.name || "Umum";
  };

  return (
    <section id="reviews" className="bg-slate-50 text-[#1A1A1A] py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#DA291C] font-mono font-bold block mb-2">Bukti Kualitas Nyata</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">Ulasan Pemilik Chery</h2>
            <p className="mt-3 text-slate-500 text-xs sm:text-sm">Dengarkan langsung testimonial jujur dari para pemilik yang telah merasakan kenyamanan berkendara bersama Chery.</p>
          </div>

          <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 bg-[#DA291C] hover:bg-red-700 text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm shadow-[#DA291C]/15 w-fit self-start">
            <PenTool className="w-4 h-4" /> Tulis Ulasan Anda
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-12 p-6 sm:p-8 bg-white border border-slate-200 rounded-sm relative shadow-md">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#DA291C]" /> Bagikan Pengalaman Berkendara Anda
            </h3>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-sm flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">Ulasan Sukses Terkirim!</h4>
                <p className="text-xs text-slate-500">Terima kasih atas kontribusi Anda. Ulasan Anda telah diterbitkan secara instan.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5 font-sans">
                {submitError && (
                  <div className="rounded-sm bg-red-50 border border-red-100 p-3 text-xs text-red-700">
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
                    <input type="text" required placeholder="Masukkan nama Anda" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C]" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Model Mobil Chery</label>
                    <select value={newReview.carModel} onChange={(e) => setNewReview({ ...newReview, carModel: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#DA291C]">
                      {allCars.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Rating Anda</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-sm w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="hover:scale-110 transition-transform">
                          <Star className={`w-5 h-5 ${star <= newReview.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Isi Ulasan</label>
                  <textarea required rows={4} placeholder="Tuliskan ulasan mendalam Anda tentang kenyamanan kabin, tarikan mesin, konsumsi bahan bakar/baterai, fitur ADAS, dan lainnya..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#DA291C] leading-relaxed" />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-sm text-xs font-bold uppercase text-slate-400 hover:text-slate-800">Batal</button>
                  <button type="submit" disabled={submitting} className="bg-[#DA291C] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-sm text-xs uppercase shadow-sm disabled:opacity-60">
                    {submitting ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          <div className="lg:col-span-4 p-6 sm:p-8 bg-white border border-slate-200 rounded-sm flex flex-col justify-between shadow-sm">
            <div className="text-center sm:text-left">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mb-2">Skor Kepuasan Rata-rata</span>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <span className="text-5xl font-extrabold tracking-tight text-[#1A1A1A] font-sans">{averageRating}</span>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />))}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Berdasarkan {filteredReviews.length} Ulasan</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6 border-t border-slate-200 pt-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = countStars(stars);
                const percent = Math.round((count / totalCount) * 100);
                return (
                  <div key={stars} className="flex items-center text-xs gap-3 font-sans">
                    <span className="w-3 text-slate-400 font-bold">{stars}</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-[#DA291C] rounded-sm transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-medium">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-sm flex flex-col justify-between gap-6 shadow-sm">
            <div className="font-sans">
              <h4 className="text-sm font-bold text-[#1A1A1A] mb-2">Filter Berdasarkan Model SUV:</h4>
              <p className="text-xs text-slate-400">Pilih model mobil spesifik untuk memfilter ulasan dari para pemilik sesungguhnya.</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { id: "all", label: "Semua Ulasan (" + reviews.length + ")" },
                ...allCars.map((m) => ({ id: m.id, label: m.name + " (" + reviews.filter((r) => r.carModel === m.id).length + ")" }))
              ].map((filter) => (
                <button key={filter.id} onClick={() => setFilterModel(filter.id)} className={`px-4.5 py-2.5 rounded-sm text-xs font-bold tracking-wide transition-all duration-300 ${filterModel === filter.id ? "bg-[#DA291C] text-white shadow-sm" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"}`}>
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-100 border border-slate-200 p-4 rounded-sm flex items-center gap-3 text-xs text-[#DA291C] font-sans">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="text-slate-600 font-semibold">Semua ulasan di platform ini diverifikasi menggunakan nomor rangka kendaraan (VIN) resmi pemilik oleh Chery.</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-sm font-sans">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h5 className="text-sm font-bold text-[#1A1A1A]">Belum Ada Ulasan</h5>
              <p className="text-xs text-slate-400 mt-1">Jadilah yang pertama untuk menulis ulasan model ini!</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-6 bg-white border border-slate-200 rounded-sm flex flex-col justify-between space-y-4 font-sans hover:border-slate-300 transition-all duration-300 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-[#DA291C]">{review.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-sm">
                            <CheckCircle className="w-2.5 h-2.5" /> Verified Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{review.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`w-4 h-4 ${star <= review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`} />))}
                    </div>
                    <span className="text-[9px] text-[#DA291C] font-mono font-bold uppercase tracking-widest mt-1.5 bg-red-50 border border-red-100 py-0.5 px-2 rounded-sm inline-block">Model: {getCarTitle(review.carModel)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pl-0 sm:pl-13">{review.comment}</p>

                <div className="flex items-center gap-4 pl-0 sm:pl-13 pt-2 border-t border-slate-100">
                  <button onClick={() => handleLike(review.id)} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors group">
                    <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 group-hover:text-[#DA291C] transition-all" /> Membantu ({review.likes})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
