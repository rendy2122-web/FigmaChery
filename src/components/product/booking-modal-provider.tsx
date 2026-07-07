"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import BookingForm from "./booking-form";

interface CarData {
  id: string;
  name: string;
  basePrice?: string;
}

interface BookingModalContextValue {
  openBookingModal: (type: "test" | "prebook", carId?: string) => void;
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
  children,
}: {
  cars: CarData[];
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"test" | "prebook">("test");
  const [activeCarId, setActiveCarId] = useState<string | undefined>(undefined);

  const openBookingModal = useCallback((nextType: "test" | "prebook", carId?: string) => {
    setType(nextType);
    setActiveCarId(carId);
    setIsOpen(true);
  }, []);

  const activeCar = cars.find((c) => c.id === activeCarId) ?? cars[0];

  return (
    <BookingModalContext.Provider value={{ openBookingModal }}>
      {children}
      {activeCar && (
        <BookingForm
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type={type}
          cars={cars}
          activeCar={activeCar}
        />
      )}
    </BookingModalContext.Provider>
  );
}
