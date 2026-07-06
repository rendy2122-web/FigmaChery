export interface CarColor {
  name: string;
  hex: string;
  bgClass: string;
}

export interface HighlightItem {
  title: string;
  description: string;
  iconName: string;
}

export interface SpecCategory {
  categoryName: string;
  items: {
    name: string;
    value: string;
  }[];
}

export interface CarModel {
  id: string;
  name: string;
  tagline: string;
  type: "EV" | "ICE" | "PHEV";
  typeName: string;
  basePrice: string;
  formattedPrice: string;
  description: string;
  heroImage: string;
  interiorImage: string;
  techImage: string;
  accentColor: string;
  colors: CarColor[];
  highlights: HighlightItem[];
  specs: SpecCategory[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  carModel: string;
  verified: boolean;
  likes: number;
}

export interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  carModel: string;
  preferredDate: string;
  preferredTime: string;
  testDriveRequired: boolean;
}
