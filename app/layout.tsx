import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-pricvo",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pricvo.com"),
  title: {
    default: "Pricvo — Best Bathroom Vanity & Mirror Deals",
    template: "%s | Pricvo"
  },
  description:
    "Handpicked bathroom vanity and mirror deals from Amazon, Home Depot, Wayfair and Lowe's. Price-tracked and updated regularly.",
  keywords: [
    "bathroom vanity deals",
    "bathroom mirror deals",
    "vanity sale",
    "home depot vanity",
    "wayfair vanity deals"
  ],
  authors: [{ name: "Pricvo" }],
  creator: "Pricvo",
  publisher: "Pricvo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pricvo.com",
    siteName: "Pricvo",
    title: "Pricvo — Best Bathroom Vanity & Mirror Deals",
    description: "Handpicked bathroom vanity and mirror deals. Price-tracked from top US retailers.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pricvo — Home Deals"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricvo — Best Bathroom Vanity & Mirror Deals",
    description: "Handpicked bathroom vanity and mirror deals from top US retailers.",
    images: ["/og-default.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={"font-sans"}>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "cf9d0e8147904a269923c5f3cd7b4087"}'
        />{children}</body>
    </html>
  );
}
