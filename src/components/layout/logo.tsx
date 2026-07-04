import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link href="/" className={cn("block", className)}>
      <Image
        src="/chery-logo.png"
        alt={siteConfig.name}
        width={294}
        height={176}
        className={cn("h-11 w-auto", variant === "light" && "brightness-0 invert")}
        priority
      />
    </Link>
  );
}
