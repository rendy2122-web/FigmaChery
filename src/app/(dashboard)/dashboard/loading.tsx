export default function DashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-foreground" />
        <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
      </div>
    </div>
  );
}