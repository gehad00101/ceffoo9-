
"use client";

import Link from 'next/link';
import { Menu, ShoppingCart, LogOut, LogIn, Coffee } from 'lucide-react'; // Added Coffee icon
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAppStore } from '@/hooks/use-app-store';
import React, { useEffect } from 'react';
import PersonalizedWelcomeMessage from './PersonalizedWelcomeMessage';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#products', label: 'منتجاتنا' }, // Shows all products (coffee & tools)
  { href: '/coffee-selection', label: 'القهوة' }, // New link for coffee products only
  { href: '/coffee-tools', label: 'أدوات القهوة' }, // Existing link for tools only
  { href: '/#about', label: 'من نحن' },
  { href: '/#contact', label: 'اتصل بنا' },
];

export default function Header() {
  const { cartItemCount, openModal, loggedInUser, logout, fetchPersonalizedWelcome } = useAppStore();
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
    <header className="bg-gradient-to-r from-amber-900 to-amber-700 text-white shadow-lg p-4 md:p-6 rounded-b-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold mb-4 md:mb-0 transform transition-transform duration-300 hover:scale-105 flex items-center gap-2">
          <Coffee className="h-8 w-8" /> {/* Added Coffee icon */}
          متجر القهوة الفاخرة
        </Link>
        
        <div className="w-full md:w-auto flex flex-col items-center gap-2 mb-2 md:mb-0">
          {loggedInUser && <PersonalizedWelcomeMessage />}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-amber-800">
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
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 sm:px-4 rounded-full transition duration-300 shadow-md text-sm md:text-base"
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

          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-amber-200"
            onClick={() => openModal('cart')}
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
