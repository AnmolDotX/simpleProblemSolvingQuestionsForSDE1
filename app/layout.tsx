import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SDE 1 Frontend Interview Questions | Revise & Practice",
  description:
    "Ultimate collection of SDE 1 frontend interview questions to revise and practice. Master React, JavaScript, System Design, and UI-focused DSA for high-paying developer jobs.",
  keywords: [
    "SDE 1 frontend interview questions",
    "revise",
    "practice",
    "frontend developer",
    "high paying jobs",
    "React interview prep",
    "frontend DSA",
    "JavaScript deep dive",
  ],
  alternates: {
    canonical: "https://sde1-frontend-prep.vercel.app",
  },
  openGraph: {
    title: "SDE 1 Frontend Interview Questions | Revise & Practice",
    description:
      "The ultimate cheat sheet & practice tracker for landing high-paying frontend roles.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDE 1 Frontend Interview Prep",
    description:
      "Track your progress and ace your frontend SDE 1 interviews. Practice React, JS, and UI structured data.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SDE 1 Frontend Interview Questions",
              url: "https://sde1-frontend-prep.vercel.app",
              description:
                "Collection of SDE 1 frontend interview questions to revise and practice.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://sde1-frontend-prep.vercel.app/round-2?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
