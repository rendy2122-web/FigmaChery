export interface MurabahaInput {
  /** Harga perolehan kendaraan (OTR), dalam Rupiah */
  vehiclePrice: number;
  /** Uang muka, dalam persen (0-90) */
  downPaymentPercent: number;
  /** Margin keuntungan flat per tahun, dalam persen */
  marginRatePercent: number;
  /** Tenor pembiayaan, dalam bulan */
  tenorMonths: number;
}

export interface MurabahaResult {
  vehiclePrice: number;
  downPaymentAmount: number;
  financedPrincipal: number;
  totalMarginAmount: number;
  totalReceivable: number;
  monthlyInstallment: number;
  tenorYears: number;
}

/**
 * Simulasi pembiayaan Murabahah (jual-beli cost-plus syariah): lembaga
 * pembiayaan membeli kendaraan lalu menjualnya kembali ke nasabah dengan
 * margin keuntungan flat yang disepakati di awal — bukan bunga majemuk.
 */
export function calculateMurabaha({
  vehiclePrice,
  downPaymentPercent,
  marginRatePercent,
  tenorMonths,
}: MurabahaInput): MurabahaResult {
  const tenorYears = tenorMonths / 12;
  const downPaymentAmount = vehiclePrice * (downPaymentPercent / 100);
  const financedPrincipal = vehiclePrice - downPaymentAmount;
  const totalMarginAmount = financedPrincipal * (marginRatePercent / 100) * tenorYears;
  const totalReceivable = financedPrincipal + totalMarginAmount;
  const monthlyInstallment = tenorMonths > 0 ? totalReceivable / tenorMonths : 0;

  return {
    vehiclePrice,
    downPaymentAmount,
    financedPrincipal,
    totalMarginAmount,
    totalReceivable,
    monthlyInstallment,
    tenorYears,
  };
}

export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}
