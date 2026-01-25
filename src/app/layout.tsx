import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Cart from "@/components/Cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutraLens - AI-Powered Supplement Intelligence",
  description:
    "Get personalized, science-backed supplement recommendations powered by AI. Stop guessing with generic formulas. Optimize your health with NutraLens.",
  keywords: [
    "supplement recommendations",
    "AI nutrition",
    "personalized supplements",
    "supplement interactions",
    "health optimization",
    "supplement safety",
    "nutrition AI",
  ],
  authors: [{ name: "NutraLens" }],
  creator: "NutraLens",
  publisher: "NutraLens",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nutralens.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NutraLens - AI-Powered Supplement Intelligence",
    description:
      "Get personalized, science-backed supplement recommendations powered by AI. Stop guessing with generic formulas.",
    url: "https://nutralens.com",
    siteName: "NutraLens",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutraLens - AI-Powered Supplement Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutraLens - AI-Powered Supplement Intelligence",
    description:
      "Get personalized, science-backed supplement recommendations powered by AI.",
    images: ["/og-image.png"],
    creator: "@nutralens",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="theme-color" content="#10B981" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Cart />
        </Providers>
      </body>
    </html>
  );
}
