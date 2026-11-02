import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookwell | Hair & beauty appointments",
  description: "Book your next cut, colour or manicure at Bookwell Salon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            Bookwell
          </Link>
          <nav>
            <Link href="/">Services</Link>
            <Link href="/my-bookings">My bookings</Link>
            <Link href="/staff">Staff</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">Bookwell Salon · 214 Queen St W, Toronto · (416) 555-0142</footer>
      </body>
    </html>
  );
}
