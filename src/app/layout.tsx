import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setlist Visualizer",
  description: "A beautiful way to view your concert history from Setlist.fm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
