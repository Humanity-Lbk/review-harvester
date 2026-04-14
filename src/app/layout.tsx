import type { Metadata } from "next";
import { Young_Serif, Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Review Accelerator — Free for Lubbock Chamber Members | Humanity AI",
  description:
    "The Lubbock Chamber has partnered with Humanity AI to bring free Google review automation to every member. 10 reviews a month, on autopilot.",
  openGraph: {
    title: "Your Reviews. On Autopilot.",
    description:
      "Free review automation for Lubbock Chamber members. 10 Google reviews a month — no contract, no card.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
