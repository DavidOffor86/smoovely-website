import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingCallButton from "../components/FloatingCallButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://smoovelylogistics.com";
const siteName = "Smoovely QuickMove";
const description =
  "Fast, reliable removals, logistics and storage across the UK. Home removals, office moves, man and van, clearance and secure storage — get an instant, transparent quote in under 90 seconds.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smoovely QuickMove — Removals, Logistics & Storage Across the UK",
    template: "%s | Smoovely QuickMove",
  },
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "removals",
    "house removals",
    "office removals",
    "man and van",
    "logistics",
    "storage",
    "self storage",
    "house clearance",
    "office relocation",
    "moving company UK",
    "same day delivery",
    "instant moving quote",
    "Smoovely",
  ],
  category: "Removals, Logistics & Storage",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName,
    title: "Smoovely QuickMove — Removals, Logistics & Storage Across the UK",
    description,
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Smoovely QuickMove removals and logistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoovely QuickMove — Removals, Logistics & Storage Across the UK",
    description,
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2a4a",
};

// Organization + LocalBusiness (MovingCompany) structured data — renders on
// every page so Google understands the brand, services and contact details.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "MovingCompany"],
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  legalName: "Smoovely Logistics",
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  image: `${siteUrl}/images/hero.jpg`,
  description,
  areaServed: { "@type": "Country", name: "United Kingdom" },
  knowsAbout: [
    "Home removals",
    "Office relocations",
    "Man and van",
    "Logistics and delivery",
    "Self storage",
    "House and site clearance",
  ],
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-white text-navy">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}
