import type { Service, Stylist, WorkingHours } from "./types";

const h = (start: number, end: number): WorkingHours => ({ start: start * 60, end: end * 60 });

export const services: Service[] = [
  {
    id: "womens-cut",
    name: "Women's cut & style",
    category: "Hair",
    description: "Consultation, wash, precision cut and a finished blow-dry.",
    durationMin: 60,
    priceCents: 6500,
    popularity: 9,
  },
  {
    id: "mens-cut",
    name: "Men's cut",
    category: "Hair",
    description: "Clipper or scissor cut, hot towel and styling.",
    durationMin: 30,
    priceCents: 3500,
    popularity: 8,
  },
  {
    id: "wash-blow-dry",
    name: "Wash & blow-dry",
    category: "Hair",
    description: "Relaxing wash with a smooth or voluminous finish.",
    durationMin: 45,
    priceCents: 4500,
    popularity: 8,
  },
  {
    id: "kids-cut",
    name: "Children's cut",
    category: "Hair",
    description: "For under 12s. Patience and stickers included.",
    durationMin: 30,
    priceCents: 2500,
    popularity: 5,
  },
  {
    id: "full-colour",
    name: "Full colour",
    category: "Colour",
    description: "Single-process permanent colour from roots to ends.",
    durationMin: 90,
    priceCents: 12000,
    popularity: 7,
  },
  {
    id: "balayage",
    name: "Balayage",
    category: "Colour",
    description: "Hand-painted lightening for a soft, lived-in look. Includes toner.",
    durationMin: 150,
    priceCents: 21000,
    popularity: 6,
  },
  {
    id: "root-touch-up",
    name: "Root touch-up",
    category: "Colour",
    description: "Regrowth coverage up to 3 cm.",
    durationMin: 60,
    priceCents: 8500,
    popularity: 4,
  },
  {
    id: "gloss",
    name: "Gloss treatment",
    category: "Colour",
    description: "Adds shine and refreshes tone between colour visits.",
    durationMin: 30,
    priceCents: 4000,
    popularity: 3,
  },
  {
    id: "manicure",
    name: "Classic manicure",
    category: "Nails & Brows",
    description: "Shape, cuticle care, hand massage and polish.",
    durationMin: 45,
    priceCents: 3800,
    popularity: 6,
  },
  {
    id: "gel-pedicure",
    name: "Gel pedicure",
    category: "Nails & Brows",
    description: "Soak, exfoliation and long-wear gel polish.",
    durationMin: 60,
    priceCents: 5500,
    popularity: 5,
  },
  {
    id: "brow-tint",
    name: "Brow shape & tint",
    category: "Nails & Brows",
    description: "Wax, tweeze and tint for defined brows.",
    durationMin: 30,
    priceCents: 2800,
    popularity: 4,
  },
];

export const stylists: Stylist[] = [
  {
    id: "amara",
    name: "Amara Okafor",
    title: "Senior stylist",
    serviceIds: ["womens-cut", "mens-cut", "wash-blow-dry", "kids-cut", "full-colour", "balayage", "root-touch-up", "gloss"],
    hours: { 2: h(9, 17), 3: h(9, 17), 4: h(9, 17), 5: h(9, 17), 6: h(9, 17) },
  },
  {
    id: "marco",
    name: "Marco Bianchi",
    title: "Barber & stylist",
    serviceIds: ["womens-cut", "mens-cut", "wash-blow-dry", "kids-cut"],
    hours: { 1: h(10, 18), 2: h(10, 18), 3: h(10, 18), 4: h(10, 18), 5: h(10, 18) },
  },
  {
    id: "priya",
    name: "Priya Shah",
    title: "Colour specialist",
    serviceIds: ["full-colour", "balayage", "root-touch-up", "gloss", "wash-blow-dry"],
    hours: { 0: h(10, 16), 3: h(9, 17), 4: h(9, 17), 5: h(9, 17), 6: h(9, 17) },
  },
  {
    id: "lena",
    name: "Lena Fischer",
    title: "Nail & brow technician",
    serviceIds: ["manicure", "gel-pedicure", "brow-tint"],
    hours: { 1: h(9, 17), 2: h(9, 17), 3: h(9, 17), 4: h(9, 17), 5: h(9, 17), 6: h(9, 17) },
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    title: "Stylist",
    serviceIds: ["womens-cut", "mens-cut", "wash-blow-dry", "kids-cut", "gloss"],
    hours: { 0: h(11, 17), 1: h(11, 19), 4: h(11, 19), 5: h(11, 19), 6: h(9, 15) },
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getStylist(id: string): Stylist | undefined {
  return stylists.find((s) => s.id === id);
}

export function stylistsForService(serviceId: string): Stylist[] {
  return stylists.filter((s) => s.serviceIds.includes(serviceId));
}
