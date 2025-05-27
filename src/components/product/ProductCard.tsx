"use client";

import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/hooks/use-app-store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openModal } = useAppStore();

  const handleCardClick = () => {
    openModal('productDetail', product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event when button is clicked
    addToCart(product, 1);
  };

  return (
    <Card 
      className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
      aria-label={`عرض تفاصيل ${product.name}`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={product.dataAiHint || 'coffee product'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold mb-2 text-primary">{product.name}</CardTitle>
        <CardDescription className="text-sm mb-4 text-foreground/80 line-clamp-3">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <span className="text-3xl font-bold text-accent">{product.price.toFixed(2)} ر.س</span>
        <Button 
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-5 rounded-full shadow-md"
          aria-label={`إضافة ${product.name} إلى السلة`}
        >
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}