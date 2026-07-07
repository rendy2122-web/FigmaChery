"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useBookingModal } from "@/components/product/booking-modal-provider";

interface TestDriveButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  type?: "test" | "prebook";
  carId?: string;
  /** Pass the dealer's id when this button lives on that dealer's own page —
   *  the popup then pre-fills it instead of asking, since it's already implied. */
  dealerId?: string;
  children: ReactNode;
}

/** Opens the shared booking popup — for use inside Server Components (which
 *  can't call hooks directly) that need a single "Jadwalkan Test Drive" CTA. */
export function TestDriveButton({
  className,
  variant,
  type = "test",
  carId,
  dealerId,
  children,
}: TestDriveButtonProps) {
  const { openBookingModal } = useBookingModal();

  return (
    <Button className={className} variant={variant} onClick={() => openBookingModal(type, carId, dealerId)}>
      {children}
    </Button>
  );
}
