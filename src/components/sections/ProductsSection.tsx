
"use client";

import React from 'react';
import ProductList from '@/components/product/ProductList';
// Removed imports related to AI recommendations as the feature is being removed
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { AlertCircle, Lightbulb, Search, Coffee } from 'lucide-react';
// import { getCoffeeRecommendations } from '@/ai/flows/coffee-recommendation-flow';
// import type { CoffeeRecommendationOutput } from '@/ai/flows/coffee-recommendation-flow';
import { useAppStore } from '@/hooks/use-app-store';
// import type { Product } from '@/types'; // Product type might still be needed if we were to interact with products here, but ProductList handles it.

export default function ProductsSection() {
  // Removed state and functions related to AI recommendations
  // const [tasteProfileInput, setTasteProfileInput] = useState('');
  // const [recommendations, setRecommendations] = useState<CoffeeRecommendationOutput['recommendations'] | null>(null);
  // const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  // const [recommendationError, setRecommendationError] = useState<string | null>(null);
  
  const { products: allProductsFromStore } = useAppStore((state) => ({
    products: state.products,
  }));

  // Removed handleFetchRecommendations and handleRecommendationClick

  // Calculate a quarter of the products to display
  const displayCount = Math.ceil(allProductsFromStore.length / 4);
  const featuredProducts = allProductsFromStore.slice(0, displayCount);

  return (
    <section id="products" className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">
        منتجاتنا المميزة
      </h2>

      {/* The AI recommendation Card has been removed from here */}

      <ProductList products={featuredProducts} /> {/* Pass the subset of products */}
    </section>
  );
}
