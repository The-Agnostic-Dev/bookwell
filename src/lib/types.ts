export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Service {
  id: string;
  name: string;
  category: "Hair" | "Colour" | "Nails & Brows";
  description: string;
  durationMin: number;
  priceCents: number;
  popularity: number;
}

export interface WorkingHours {
  start: number; // minutes after midnight
  end: number;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  serviceIds: string[];
  hours: Partial<Record<Weekday, WorkingHours>>;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: number;
  ref: string;
  serviceId: string;
  stylistId: string;
  date: string; // YYYY-MM-DD, salon local date
  startMin: number;
  endMin: number;
  customerName: string;
  customerEmail: string;
  priceCents: number;
  taxCents: number;
  totalCents: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingView extends Booking {
  serviceName: string;
  stylistName: string;
}

export interface Slot {
  startMin: number;
  stylistIds: string[];
}
