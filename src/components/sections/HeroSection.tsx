"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section id="home" className="relative bg-cover bg-center h-96 flex items-center justify-center text-white rounded-b-lg overflow-hidden shadow-inner">
      <Image 
        src="https://placehold.co/1200x600.png" 
        alt="قهوة طازجة" 
        layout="fill" 
        objectFit="cover" 
        quality={80}
        className="filter brightness-75" // Darken the image slightly for better text contrast
        data-ai-hint="fresh coffee"
      />
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay */}
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
          استمتع بأفضل أنواع القهوة
        </h1>
        <p className="text-lg md:text-xl mb-8 animate-fade-in-up">
          نقدم لك أجود حبوب البن من جميع أنحاء العالم
        </p>
        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '1s'}}>
          <Link href="#products">
            اكتشف منتجاتنا
          </Link>
        </Button>
      </div>
    </section>
  );
}