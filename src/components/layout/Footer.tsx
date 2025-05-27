"use client";

import Link from 'next/link';
import { TwitterIcon } from '@/components/icons/TwitterIcon'; // Custom SVG
import { Instagram, Facebook } from 'lucide-react';
import { useAppStore } from '@/hooks/use-app-store';

export default function Footer() {
  const { openModal } = useAppStore();

  return (
    <footer id="contact" className="bg-gray-900 text-white py-8 px-4 mt-12 rounded-t-lg shadow-inner">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">تواصل معنا</h3>
        <p className="mb-2">البريد الإلكتروني: info@coffeeshop.com</p>
        <p className="mb-4">الهاتف: +966 50 123 4567</p>
        <div className="flex justify-center space-x-6 mb-4"> {/* Increased space for RTL */}
          <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition duration-300">
            <TwitterIcon className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition duration-300">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition duration-300">
            <Facebook className="w-6 h-6" />
          </a>
        </div>
        <button 
          onClick={() => openModal('tracking')}
          className="text-amber-400 hover:text-amber-200 transition duration-300 text-lg"
        >
          تتبع طلبك
        </button>
        <p className="mt-6 text-gray-500">&copy; {new Date().getFullYear()} متجر القهوة الفاخرة. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}