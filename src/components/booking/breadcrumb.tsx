import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Container } from "@/components/layout/container";

export function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#e5e5e5]">
      <Container className="flex h-12 items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-foreground/80 transition-colors hover:text-foreground"
        >
          Beranda
        </Link>
        <ChevronRightIcon
          className="size-4 text-foreground/50"
          aria-hidden="true"
        />
        <span className="font-bold text-foreground" aria-current="page">
          Test Drive & Pre-Booking
        </span>
      </Container>
    </nav>
  );
}
