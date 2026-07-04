"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Dashboard Error
        </h2>
        <p className="max-w-md text-muted-foreground">
          Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-md bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Coba Lagi
      </button>
    </div>
  );
}