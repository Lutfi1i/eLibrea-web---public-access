import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from 'next/font/google';
import Providers from '@/components/Providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Optional: 'swap' ensures text remains visible during font loading
  variable: '--font-poppins', // Optional: defines a CSS variable for easier use with Tailwind CSS
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify desired weights
});

export const metadata = {
  title: "eLibrea",
  description: "Librea - Pinjam buku seklah jadi lebih mudah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
