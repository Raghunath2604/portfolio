import { Geist, Geist_Mono, Baloo_2, Dancing_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import MickyChat from "@/components/ui/MickyChat";
import { SITE_URL } from '@/lib/siteConfig';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const description =
  'AI/ML Engineer specializing in MLOps, scalable deployment, and cloud infrastructure — architecting end-to-end ML lifecycles and production-grade systems.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Raghunathareddy GR | AI/ML Engineer',
    template: '%s | Raghunathareddy GR',
  },
  description,
  keywords: [
    'Raghunathareddy GR',
    'AI/ML Engineer',
    'MLOps',
    'Machine Learning Engineer',
    'Cloud Infrastructure',
    'Kubernetes',
    'MLflow',
    'CI/CD Automation',
    'Feature Store',
    'Bengaluru',
  ],
  authors: [{ name: 'Raghunathareddy GR', url: SITE_URL }],
  creator: 'Raghunathareddy GR',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Raghunathareddy GR',
    title: 'Raghunathareddy GR | AI/ML Engineer',
    description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Raghunathareddy GR | AI/ML Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raghunathareddy GR | AI/ML Engineer',
    description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
      { url: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicons/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Raghunathareddy GR',
              url: SITE_URL,
              email: 'raghunathareddygr94@gmail.com',
              jobTitle: 'AI/ML Engineer',
              sameAs: [
                'https://github.com/Raghunath2604',
                'https://www.linkedin.com/in/raghunathareddy-gr-30a964341',
              ],
            }),
          }}
        />
        <Cursor />
        {children}
        <MickyChat />
        <Analytics />
      </body>
    </html>
  );
}
