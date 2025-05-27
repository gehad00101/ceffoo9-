"use client";

import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import type { Product } from '@/types';

// تحديد بعض المنتجات كـ "الأكثر مبيعًا" للعرض
// في تطبيق حقيقي، سيتم تحديد هذه المنتجات بناءً على بيانات المبيعات
const bestSellingProducts: Product[] = products.slice(0, 3); // اختيار أول 3 منتجات كأمثلة

export default function BestSellingSection() {
  if (!bestSellingProducts || bestSellingProducts.length === 0) {
    return null; // لا تعرض القسم إذا لم يتم تحديد منتجات الأكثر مبيعًا
  }

  return (
    <section id="best-selling" className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">
        الأكثر مبيعًا لدينا
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bestSellingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
