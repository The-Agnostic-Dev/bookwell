"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "price", label: "Price: low to high" },
  { value: "duration", label: "Duration: shortest first" },
  { value: "name", label: "Name: A to Z" },
];

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label>
      Sort by{" "}
      <select
        aria-label="Sort services"
        value={value}
        onChange={(e) => router.push(e.target.value === "popular" ? "/" : `/?sort=${e.target.value}`)}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
