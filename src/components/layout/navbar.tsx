"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRightIcon, ChevronDownIcon, MenuIcon, CalculatorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site-config";
import { ModelMegaMenu } from "@/components/layout/model-mega-menu";
import { MobileModelMenu } from "@/components/layout/mobile-model-menu";
import { MurabahaCalculator } from "@/components/finance/murabaha-calculator";

export function Navbar() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isModelOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsModelOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModelOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModelOpen]);

  return (
    <header 
      ref={navRef} 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        (isScrolled || isModelOpen)
          ? "bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-xs" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-2">
            {siteConfig.primaryNav.map((item, index) => {
              if (item.label === "Model") {
                return (
                  <li key={item.href} className="relative flex h-full items-center">
                    <button
                      type="button"
                      onClick={() => setIsModelOpen((v) => !v)}
                      aria-expanded={isModelOpen}
                      className="flex items-center gap-1 px-5 py-2.5 text-base font-normal text-foreground transition-colors hover:text-foreground/70"
                    >
                      Model
                      <ChevronDownIcon
                        className={
                          isModelOpen
                            ? "size-3.5 rotate-180 transition-transform"
                            : "size-3.5 transition-transform"
                        }
                        aria-hidden="true"
                      />
                    </button>
                    {index === 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-5 h-1.5 w-11 rounded-full bg-brand"
                      />
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href} className="relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-5 py-2.5 text-base font-normal text-foreground transition-colors hover:text-foreground/70"
                  >
                    {item.label}
                  </Link>
                  {index === 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-5 h-1.5 w-11 rounded-full bg-brand"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="h-10 gap-1.5 rounded-sm px-4 text-xs font-bold uppercase tracking-wider border-slate-200 text-slate-700 hover:bg-[#DA291C]/5 hover:text-[#DA291C] hover:border-[#DA291C]/30 transition-all duration-300"
                />
              }
            >
              <CalculatorIcon className="size-3.5" aria-hidden="true" />
              Simulasi Kredit
            </DialogTrigger>
            <DialogContent>
              <MurabahaCalculator />
            </DialogContent>
          </Dialog>
          <Button
            className="h-10 rounded-sm px-5 text-xs font-bold uppercase tracking-wider bg-[#DA291C] text-white hover:bg-slate-950 transition-all duration-300 shadow-md hover:shadow-lg"
            render={<Link href="/booking" />}
          >
            Book Test Drive
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
                {siteConfig.primaryNav.map((item) => {
                  if (item.label === "Model") {
                    return (
                      <li key={item.href}>
                        <MobileModelMenu />
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <SheetClose
                        render={
                          <Link
                            href={item.href}
                            className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        }
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        className="h-11 w-full gap-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border-slate-200 text-slate-700 hover:bg-[#DA291C]/5 hover:text-[#DA291C] hover:border-[#DA291C]/30 transition-all duration-300"
                      />
                    }
                  >
                    <CalculatorIcon className="size-3.5" aria-hidden="true" />
                    Simulasi Kredit
                  </DialogTrigger>
                  <DialogContent>
                    <MurabahaCalculator />
                  </DialogContent>
                </Dialog>
                <Button
                  className="h-11 w-full rounded-sm text-xs font-bold uppercase tracking-wider bg-[#DA291C] text-white hover:bg-slate-950 transition-all duration-300 shadow-md"
                  render={<Link href="/booking" />}
                >
                  Book Test Drive
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>

      {isModelOpen && (
        <div className="absolute inset-x-0 top-full border-t border-border bg-background shadow-lg">
          <Container>
            <ModelMegaMenu onNavigate={() => setIsModelOpen(false)} />
          </Container>
        </div>
      )}
    </header>
  );
}
