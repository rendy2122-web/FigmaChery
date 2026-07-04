"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Terjadi Kesalahan
        </h1>
        <p className="max-w-md text-muted-foreground">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
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