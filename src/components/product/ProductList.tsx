"use client";

import ProductCard from './ProductCard';
import { useAppStore } from '@/hooks/use-app-store';
import type { Product } from '@/types'; // Import Product type

export default function ProductList() {
  const allProducts = useAppStore((state) => state.products);

  // No filtering here, display all products by default.
  // Specific pages like /coffee-tools or /coffee-selection will handle their own filtering.
  const productsToDisplay: Product[] = allProducts;

  if (!productsToDisplay || productsToDisplay.length === 0) {
    return <p className="text-center text-lg text-foreground/70">لا توجد منتجات لعرضها حالياً.</p>;
  }

  return (
    <div id="product-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {productsToDisplay.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
