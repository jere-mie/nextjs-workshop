import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Cravings",
  description: "Rate your favorite meals on campus!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
