/** Ontario HST. */
export const TAX_RATE = 0.13;

export function priceWithTax(priceCents: number) {
  const taxCents = Math.round(priceCents * TAX_RATE);
  return { priceCents, taxCents, totalCents: priceCents + taxCents };
}
