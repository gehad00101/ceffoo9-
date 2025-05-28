
import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; 
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProvider from '@/components/AppProvider'; 

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'arabic'], // Added arabic
});

export const metadata: Metadata = {
  title: 'اختبار الفراعنة | Pharaoh\'s Quiz', 
  description: 'اختبر معلوماتك عن حكام مصر القدماء وتاريخهم الغني!', 
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
