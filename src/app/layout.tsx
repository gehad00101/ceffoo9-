import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist as per existing setup
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProvider from '@/components/AppProvider'; // Renamed from contexts/AppContext

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'], // Keep latin, add 'arabic' if Geist supports and is needed for specific styles
});

// If a specific Arabic font like 'Inter' is strictly required and Geist doesn't cover Arabic well:
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin', 'arabic'], variable: '--font-inter' });
// className={`${geistSans.variable} ${inter.variable} antialiased`}

export const metadata: Metadata = {
  title: 'متجر القهوة الفاخرة', // Updated title
  description: 'استمتع بأفضل أنواع القهوة من جميع أنحاء العالم', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}