"use client";

import ProductCard from './ProductCard';
import { useAppStore } from '@/hooks/use-app-store';

export default function ProductList() {
  const products = useAppStore((state) => state.products);

  if (!products || products.length === 0) {
    return <p className="text-center text-lg text-foreground/70">لا توجد منتجات لعرضها حالياً.</p>;
  }

  return (
    <div id="product-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}