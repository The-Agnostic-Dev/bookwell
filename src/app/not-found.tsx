import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>We couldn&apos;t find that page</h1>
      <p className="muted">
        The booking or service may have been removed. <Link href="/">Back to services</Link>
      </p>
    </>
  );
}
