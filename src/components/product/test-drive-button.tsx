"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useBookingModal } from "@/components/product/booking-modal-provider";

interface TestDriveButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  type?: "test" | "prebook";
  carId?: string;
  children: ReactNode;
}

/** Opens the shared booking popup — for use inside Server Components (which
 *  can't call hooks directly) that need a single "Jadwalkan Test Drive" CTA. */
export function TestDriveButton({
  className,
  variant,
  type = "test",
  carId,
  children,
}: TestDriveButtonProps) {
  const { openBookingModal } = useBookingModal();

  return (
    <Button className={className} variant={variant} onClick={() => openBookingModal(type, carId)}>
      {children}
    </Button>
  );
}
