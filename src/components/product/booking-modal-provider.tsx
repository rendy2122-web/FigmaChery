"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import BookingForm from "./booking-form";

interface CarData {
  id: string;
  name: string;
  basePrice?: string;
}

interface DealerData {
  id: string;
  name: string;
  city: string;
}

interface BookingModalContextValue {
  /** dealerId only needs to be passed when opened from that dealer's own
   *  page — everywhere else it's left unset so the form asks the user. */
  openBookingModal: (type: "test" | "prebook", carId?: string, dealerId?: string) => void;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

/** Any client component under the root layout can call this to open the
 *  shared booking/test-drive popup instead of linking to a separate page. */
export function useBookingModal(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}

export function BookingModalProvider({
  cars,
  dealers,
  children,
}: {
  cars: CarData[];
  dealers: DealerData[];
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"test" | "prebook">("test");
  const [activeCarId, setActiveCarId] = useState<string | undefined>(undefined);
  const [presetDealerId, setPresetDealerId] = useState<string | undefined>(undefined);
  // Bumped on every open so BookingForm remounts with fresh state instead of
  // reusing form data left over from a previous, possibly different, open.
  const [openCount, setOpenCount] = useState(0);

  const openBookingModal = useCallback(
    (nextType: "test" | "prebook", carId?: string, dealerId?: string) => {
      setType(nextType);
      setActiveCarId(carId);
      setPresetDealerId(dealerId);
      setIsOpen(true);
      setOpenCount((n) => n + 1);
    },
    []
  );

  const activeCar = cars.find((c) => c.id === activeCarId) ?? cars[0];

  return (
    <BookingModalContext.Provider value={{ openBookingModal }}>
      {children}
      {activeCar && (
        <BookingForm
          key={openCount}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type={type}
          cars={cars}
          activeCar={activeCar}
          dealers={dealers}
          presetDealerId={presetDealerId}
        />
      )}
    </BookingModalContext.Provider>
  );
}
