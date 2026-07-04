import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Container } from "@/components/layout/container";

type Crumb = {
  label: string;
  href?: string;
};

export function ProductBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#e5e5e5]">
      <Container className="flex h-12 items-center gap-2 text-sm">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <ChevronRightIcon
                className="size-4 text-foreground/50"
                aria-hidden="true"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-bold text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </Container>
    </nav>
  );
}
