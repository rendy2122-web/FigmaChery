import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function LoadingSection() {
  return (
    <section className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-foreground" />
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </div>
    </section>
  );
}

export { Skeleton, LoadingSection }
