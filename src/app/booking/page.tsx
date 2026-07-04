import type { Metadata } from "next";
import { Breadcrumb } from "@/components/booking/breadcrumb";
import { BookingForm } from "@/components/booking/booking-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Test Drive & Pre-Booking",
  description:
    "Jadwalkan test drive atau pre-booking Chery Anda hari ini. Pilih model dan dealer terdekat.",
};

export default function BookingPage() {
  return (
    <>
      <Breadcrumb />
      <div className="bg-muted py-section-y">
        <Container>
          <div className="mx-auto max-w-4xl rounded bg-background shadow-sm">
            <BookingForm />
          </div>
        </Container>
      </div>
    </>
  );
}
