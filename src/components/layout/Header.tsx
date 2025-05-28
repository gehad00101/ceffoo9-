
"use client";

import Link from 'next/link';
import { Menu, ShoppingCart, LogOut, LogIn, ScrollText } from 'lucide-react'; // Changed Coffee to ScrollText
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAppStore } from '@/hooks/use-app-store';
import React, { useEffect } from 'react';
import PersonalizedWelcomeMessage from './PersonalizedWelcomeMessage';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#products', label: 'الأقسام' }, // Changed from "منتجاتنا"
  // Links like '/coffee-selection' and '/coffee-tools' might need to be re-evaluated for a quiz app
  // For now, keeping them but their relevance is reduced.
  { href: '/coffee-selection', label: 'القهوة' }, 
  { href: '/coffee-tools', label: 'أدوات القهوة' }, 
  { href: '/#about', label: 'عن الاختبار' }, // Changed from "من نحن"
  { href: '/#contact', label: 'اتصل بنا' },
];

export default function Header() {
  const { cartItemCount, openModal, loggedInUser, logout, fetchPersonalizedWelcome } = useAppStore();
  // Cart functionality might be irrelevant for a quiz app, but keeping store integration for now.
  const totalItems = cartItemCount(); 

  useEffect(() => {
    if (loggedInUser && !useAppStore.getState().personalizedWelcome) {
      fetchPersonalizedWelcome(loggedInUser.username);
    }
  }, [loggedInUser, fetchPersonalizedWelcome]);


  const handleAuthAction = () => {
    if (loggedInUser) {
      logout();
    } else {
      openModal('login');
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary via-amber-600 to-yellow-700 text-primary-foreground shadow-lg p-4 md:p-6 rounded-b-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold mb-4 md:mb-0 transform transition-transform duration-300 hover:scale-105 flex items-center gap-2">
          <ScrollText className="h-8 w-8 text-yellow-300" /> {/* Changed icon and color */}
          اختبار الفراعنة
        </Link>
        
        <div className="w-full md:w-auto flex flex-col items-center gap-2 mb-2 md:mb-0">
          {loggedInUser && <PersonalizedWelcomeMessage />}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <Menu className="h-6 w-6" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-sidebar text-sidebar-foreground p-6 w-[280px]">
              <nav className="flex flex-col gap-4 text-xl mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="block p-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition duration-200 font-semibold"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Button
            onClick={handleAuthAction}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 sm:px-4 rounded-full transition duration-300 shadow-md text-sm md:text-base"
          >
            {loggedInUser ? (
              <>
                <LogOut className="h-4 w-4 me-1 sm:me-2" />
                تسجيل الخروج
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 me-1 sm:me-2" />
                تسجيل الدخول
              </>
            )}
          </Button>

          {/* Cart icon might be removed or repurposed for a quiz app */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary-foreground hover:text-yellow-300"
            onClick={() => openModal('cart')}
            title="سلة التسوق (قد يتم إزالتها)"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="sr-only">سلة التسوق</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
