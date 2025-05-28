
import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist as per existing setup
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProvider from '@/components/AppProvider'; 

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'arabic'], 
});

export const metadata: Metadata = {
  title: 'متجر القهوة الفاخرة', 
  description: 'استمتع بأفضل أنواع القهوة من جميع أنحاء العالم', 
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
