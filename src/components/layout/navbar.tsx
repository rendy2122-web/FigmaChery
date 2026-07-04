import Link from "next/link";
import { ChevronRightIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site-config";

const hasSubmenu = new Set(["Model", "Dealer"]);

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-2">
            {siteConfig.primaryNav.map((item, index) => (
              <li key={item.href} className="relative flex h-full items-center">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-5 py-2.5 text-base font-normal text-foreground transition-colors hover:text-foreground/70"
                >
                  {item.label}
                  {hasSubmenu.has(item.label) && (
                    <ChevronRightIcon
                      className="size-3.5 rotate-90"
                      aria-hidden="true"
                    />
                  )}
                </Link>
                {index === 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-5 h-1.5 w-11 rounded-full bg-brand"
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Button
            className="h-11 rounded px-5 text-base font-bold bg-brand text-brand-foreground hover:bg-brand/90"
            render={<Link href="/booking" />}
          >
            Book Test Drive
          </Button>
          <Button
            variant="ghost"
            className="h-11 gap-1.5 rounded px-5 text-base font-normal text-foreground hover:bg-transparent hover:text-foreground/70"
            render={<Link href="#cta" />}
          >
            Hubungi Kami
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="px-4">
              <ul className="flex flex-col gap-1">
                {siteConfig.primaryNav.map((item) => (
                  <li key={item.href}>
                    <SheetClose
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {item.label}
                          {hasSubmenu.has(item.label) && (
                            <ChevronRightIcon
                              className="size-4 rotate-90"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      }
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  className="h-11 w-full rounded text-base font-bold bg-brand text-brand-foreground hover:bg-brand/90"
                  render={<Link href="/booking" />}
                >
                  Book Test Drive
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full gap-1.5 rounded text-base font-normal"
                  render={<Link href="#cta" />}
                >
                  Hubungi Kami
                  <ChevronRightIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
