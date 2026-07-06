"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { LandmarkIcon, SparkleIcon } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calculateMurabaha, formatRupiah } from "@/lib/murabaha";
import { AnimatedRupiah } from "@/components/finance/animated-rupiah";

type CarOption = {
  id: string;
  name: string;
  price_from: string;
};

const tenorOptions = [
  { label: "1 Tahun", months: 12 },
  { label: "2 Tahun", months: 24 },
  { label: "3 Tahun", months: 36 },
  { label: "4 Tahun", months: 48 },
  { label: "5 Tahun", months: 60 },
];

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

function parsePriceString(price: string): number {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function MurabahaCalculator() {
  const [cars, setCars] = useState<CarOption[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>("custom");
  const [priceInput, setPriceInput] = useState("329.800.000");
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [marginRatePercent, setMarginRatePercent] = useState(5);
  const [tenorMonths, setTenorMonths] = useState(36);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data: CarOption[]) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch(() => {});
  }, []);

  const handleCarChange = (id: string) => {
    setSelectedCarId(id);
    if (id === "custom") return;
    const car = cars.find((c) => c.id === id);
    if (car) setPriceInput(car.price_from);
  };

  const handlePriceChange = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    const asNumber = digits ? parseInt(digits, 10) : 0;
    setPriceInput(asNumber.toLocaleString("id-ID"));
    setSelectedCarId("custom");
  };

  const vehiclePrice = useMemo(() => parsePriceString(priceInput), [priceInput]);

  const result = useMemo(
    () =>
      calculateMurabaha({
        vehiclePrice,
        downPaymentPercent,
        marginRatePercent,
        tenorMonths,
      }),
    [vehiclePrice, downPaymentPercent, marginRatePercent, tenorMonths]
  );

  return (
    <>
      <DialogHeader>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-deep/30 bg-brand-deep/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-deep">
          <LandmarkIcon className="size-3.5" aria-hidden="true" />
          Simulasi Kredit Kendaraan
        </span>
        <DialogTitle>Kalkulator Simulasi Kredit</DialogTitle>
        <DialogDescription>
          Simulasikan cicilan kendaraan Chery Anda dengan margin tetap yang
          transparan sejak awal — tanpa bunga berbunga yang membengkak.
        </DialogDescription>
      </DialogHeader>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 p-6"
      >
        <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
          <label htmlFor="murabaha-car" className="text-xs font-semibold text-foreground/80">
            Pilih Model Mobil
          </label>
          <select
            id="murabaha-car"
            value={selectedCarId}
            onChange={(e) => handleCarChange(e.target.value)}
            className="h-11 w-full rounded-lg border-2 border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-brand-deep focus:outline-none"
          >
            <option value="custom">Custom (masukkan harga manual)</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
          <label htmlFor="murabaha-price" className="text-xs font-semibold text-foreground/80">
            Harga Kendaraan (OTR)
          </label>
          <div className="flex h-11 items-center overflow-hidden rounded-lg border-2 border-border bg-background transition-colors focus-within:border-brand-deep">
            <span className="border-r-2 border-border px-3 text-sm font-bold text-foreground">
              Rp
            </span>
            <input
              id="murabaha-price"
              type="text"
              inputMode="numeric"
              value={priceInput}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="h-full w-full px-3 text-sm text-foreground focus:outline-none"
            />
          </div>
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="murabaha-dp" className="text-xs font-semibold text-foreground/80">
              Uang Muka (DP)
            </label>
            <span className="text-sm font-bold text-brand-deep">
              {downPaymentPercent}%
            </span>
          </div>
          <input
            id="murabaha-dp"
            type="range"
            min={10}
            max={80}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand-deep"
          />
          <span className="text-xs text-muted-foreground">
            {formatRupiah(result.downPaymentAmount)}
          </span>
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="murabaha-margin" className="text-xs font-semibold text-foreground/80">
              Margin Keuntungan (flat/tahun)
            </label>
            <span className="text-sm font-bold text-brand-deep">
              {marginRatePercent}%
            </span>
          </div>
          <input
            id="murabaha-margin"
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={marginRatePercent}
            onChange={(e) => setMarginRatePercent(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand-deep"
          />
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground/80">Tenor Pembiayaan</span>
          <div className="flex flex-wrap gap-2">
            {tenorOptions.map((option) => (
              <button
                key={option.months}
                type="button"
                onClick={() => setTenorMonths(option.months)}
                aria-pressed={tenorMonths === option.months}
                className={
                  tenorMonths === option.months
                    ? "rounded-full bg-brand-deep px-4 py-2 text-xs font-bold text-white shadow-sm shadow-brand-deep/25 transition-all"
                    : "rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-brand-deep/40 hover:text-foreground"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fieldVariants}
          layout
          transition={{ layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
          className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-muted p-5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          />

          <div className="relative flex flex-col items-center gap-1 overflow-hidden rounded-xl bg-brand-deep px-4 py-5 text-center text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl"
            />
            <span className="relative flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
              <SparkleIcon className="size-3.5 text-gold" aria-hidden="true" />
              Estimasi Angsuran Per Bulan
            </span>
            <span className="relative text-3xl font-heading font-black tracking-tight">
              <AnimatedRupiah value={result.monthlyInstallment} />
            </span>
          </div>
        </motion.div>

        <motion.p variants={fieldVariants} className="text-[11px] leading-relaxed text-muted-foreground">
          *Simulasi ini bersifat estimasi dan tidak mengikat. Harga jual dan
          margin final akan ditentukan bersama mitra pembiayaan resmi Chery
          pada saat pengajuan.
        </motion.p>

        <motion.div variants={fieldVariants} className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="h-12 flex-1 rounded-full text-sm font-bold bg-brand-deep text-white hover:bg-brand-deep/90"
            render={<Link href="/booking" />}
          >
            Ajukan Pembiayaan
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full text-sm font-semibold"
            render={<Link href="/booking" />}
          >
            Jadwalkan Test Drive
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
