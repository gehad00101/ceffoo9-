"use client";

import ProductCard from './ProductCard';
import { useAppStore } from '@/hooks/use-app-store';
import type { Product } from '@/types'; // Import Product type

export default function ProductList() {
  const allProducts = useAppStore((state) => state.products);

  // Filter out products belonging to the 'أدوات القهوة' category
  const productsToDisplay: Product[] = allProducts.filter(
    (product) => product.category !== 'أدوات القهوة'
  );

  if (!productsToDisplay || productsToDisplay.length === 0) {
    return <p className="text-center text-lg text-foreground/70">لا توجد منتجات قهوة لعرضها حالياً.</p>;
  }

  return (
    <div id="product-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {productsToDisplay.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
