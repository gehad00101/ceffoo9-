
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/hooks/use-app-store";
import { X, Plus, Minus } from "lucide-react";

export default function ProductDetailModal() {
  const { openModalType, closeModal, modalData, addToCart, openModal } = useAppStore();
  const product = modalData as Product | undefined;

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product && openModalType === 'productDetail') {
      setQuantity(1);
      setMainImage(product.image);
      setAddedToCart(false); // Reset state when modal opens with new product
    }
  }, [product, openModalType]);

  if (openModalType !== 'productDetail' || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
  };

  const handleGoToCart = () => {
    closeModal();
    openModal('cart');
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={openModalType === 'productDetail'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-3xl bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-primary sr-only">{product.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 p-2 md:p-4">
          <div className="md:w-1/2">
            <div className="relative w-full h-64 md:h-96 rounded-lg shadow-md overflow-hidden mb-4">
              <Image 
                src={mainImage} 
                alt={product.name} 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={product.dataAiHint || 'product detail'}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[product.image, ...product.additionalImages].map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 hover:border-primary transition"
                  onClick={() => setMainImage(img)}
                  data-active={mainImage === img}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint={product.dataAiHint || 'product thumbnail'}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 text-right flex flex-col">
            <h3 className="text-3xl font-bold mb-3 text-primary">{product.name}</h3>
            <p className="text-muted-foreground text-lg mb-4 leading-relaxed flex-grow">{product.fullDescription}</p>
            
            <div className="flex items-center justify-between my-6">
              <span className="text-4xl font-bold text-accent">{product.price.toFixed(2)} ر.س</span>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                  <Minus className="h-5 w-5" />
                </Button>
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))} 
                  min="1" 
                  className="w-16 text-center p-2 border-input rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring" 
                />
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {!addedToCart ? (
              <Button 
                onClick={handleAddToCart} 
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                أضف للسلة
              </Button>
            ) : (
              <Button 
                onClick={handleGoToCart} 
                size="lg"
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                الانتقال إلى السلة
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
