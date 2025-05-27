
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ProductsSection from '@/components/sections/ProductsSection';
import BestSellingSection from '@/components/sections/BestSellingSection'; // <-- إضافة استيراد القسم الجديد

import CartModal from '@/components/modals/CartModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import TrackingModal from '@/components/modals/TrackingModal';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';
import ProductDetailModal from '@/components/modals/ProductDetailModal';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <BestSellingSection /> {/* <-- إضافة القسم الجديد هنا */}
        <ProductsSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />

      {/* Modals */}
      <CartModal />
      <CheckoutModal />
      <ConfirmationModal />
      <TrackingModal />
      <LoginModal />
      <RegisterModal />
      <ProductDetailModal />
    </div>
  );
}
