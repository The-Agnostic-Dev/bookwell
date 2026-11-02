import Link from "next/link";
import { services } from "@/lib/catalog";
import { formatDuration, formatMoney } from "@/lib/format";
import { sortBy } from "@/lib/sort";
import type { Service } from "@/lib/types";
import SortSelect from "@/components/SortSelect";

const CATEGORIES: Service["category"][] = ["Hair", "Colour", "Nails & Brows"];

function sortServices(list: Service[], sort: string): Service[] {
  switch (sort) {
    case "price":
      return sortBy(list, "priceCents");
    case "duration":
      return sortBy(list, "durationMin");
    case "name":
      return sortBy(list, "name");
    default:
      return sortBy(list, "popularity", "desc");
  }
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort = "popular" } = await searchParams;

  return (
    <>
      <div className="toolbar">
        <div>
          <h1>Book an appointment</h1>
          <p className="muted">Choose a service to see who&apos;s available and when.</p>
        </div>
        <SortSelect value={sort} />
      </div>

      {CATEGORIES.map((category) => (
        <section key={category}>
          <h2>{category}</h2>
          <div className="service-grid">
            {sortServices(
              services.filter((s) => s.category === category),
              sort,
            ).map((service) => (
              <article key={service.id} className="card service-card">
                <strong>{service.name}</strong>
                <p>{service.description}</p>
                <div className="meta">
                  <span>{formatMoney(service.priceCents)}</span>
                  <span className="muted">{formatDuration(service.durationMin)}</span>
                </div>
                <Link className="btn primary" href={`/book?service=${service.id}`}>
                  Book
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
