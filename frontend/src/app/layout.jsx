import { Cinzel, Poppins } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from './providers';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-cinzel',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

export const metadata = {
  metadataBase: new URL('https://dhruv-pooja-samagri.vercel.app'),
  title: {
    default: 'Dhruv Pooja Samagri Store | Authentic Puja Samagri, Idols & Havan Kits Online',
    template: '%s | Dhruv Pooja Samagri Store',
  },
  description:
    'Shop authentic puja thalis, idols, incense, havan samagri and diyas online at Dhruv Pooja Samagri Store. Ethically sourced, spiritually curated products delivered across India.',
  keywords: [
    'puja samagri online',
    'puja thali set',
    'idols online india',
    'havan samagri',
    'incense agarbatti',
    'diyas online',
    'pooja items store',
  ],
  authors: [{ name: 'Dhruv Pooja Samagri Store' }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Dhruv Pooja Samagri Store',
    title: 'Dhruv Pooja Samagri Store | Authentic Puja Samagri, Idols & Havan Kits Online',
    description:
      'Shop authentic puja thalis, idols, incense, havan samagri and diyas online. Ethically sourced, spiritually curated, delivered with devotion.',
    url: '/',
    images: ['/images/astrologer.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhruv Pooja Samagri Store | Authentic Puja Samagri Online',
    description:
      'Shop authentic puja thalis, idols, incense, havan samagri and diyas online. Ethically sourced, spiritually curated, delivered with devotion.',
    images: ['/images/astrologer.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Dhruv Pooja Samagri Store',
              description: 'Authentic puja samagri, idols, incense, havan kits and diyas delivered across India.',
              url: 'https://dhruv-pooja-samagri.vercel.app/',
              image: 'https://dhruv-pooja-samagri.vercel.app/images/astrologer.png',
              priceRange: '₹₹',
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
