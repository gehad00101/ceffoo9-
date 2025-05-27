
"use client";

import ProductCard from './ProductCard';
// Removed: import { useAppStore } from '@/hooks/use-app-store';
import type { Product } from '@/types';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  // Products are now passed as a prop
  const productsToDisplay: Product[] = products;

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

