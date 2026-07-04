import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading page content">
      <Section id="loading-hero" aria-hidden="true">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-40" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
          <Skeleton className="aspect-4/3 w-full" />
        </div>
      </Section>

      <Container className="grid gap-6 pb-section-y md:grid-cols-3" aria-hidden="true">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </Container>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
