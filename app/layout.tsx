import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechHire Market",
  description: "Private two-sided tech hiring marketplace for talent and employers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
