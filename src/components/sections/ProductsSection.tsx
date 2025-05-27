
"use client";

import React, { useState } from 'react';
import ProductList from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Lightbulb, Search, Coffee } from 'lucide-react';
import { getCoffeeRecommendations } from '@/ai/flows/coffee-recommendation-flow';
import type { CoffeeRecommendationOutput } from '@/ai/flows/coffee-recommendation-flow';
import { useAppStore } from '@/hooks/use-app-store';
import { products as allProducts } from '@/data/products'; // Import all products for linking

export default function ProductsSection() {
  const [tasteProfileInput, setTasteProfileInput] = useState('');
  const [recommendations, setRecommendations] = useState<CoffeeRecommendationOutput['recommendations'] | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const { openModal } = useAppStore();

  const handleFetchRecommendations = async () => {
    if (!tasteProfileInput.trim()) {
      setRecommendationError("الرجاء إدخال وصف لتفضيلاتك أولاً.");
      setRecommendations(null);
      return;
    }
    setIsLoadingRecommendations(true);
    setRecommendationError(null);
    setRecommendations(null);
    try {
      const result = await getCoffeeRecommendations({ tasteProfile: tasteProfileInput });
      if (result && result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        setRecommendations([{ productId: 'N/A', productName: 'لا توجد توصيات', reason: 'لم نتمكن من العثور على تطابق. حاول وصفًا آخر.' }]);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendationError("عذرًا، حدث خطأ أثناء جلب التوصيات. حاول مرة أخرى.");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleRecommendationClick = (productId: string) => {
    if (productId === 'N/A') return;
    const productToOpen = allProducts.find(p => p.id === productId);
    if (productToOpen) {
      openModal('productDetail', productToOpen);
    } else {
      // Optionally show a toast or message if product not found, though this shouldn't happen if flow is correct
      console.warn(`Product with ID ${productId} not found in local data.`);
    }
  };

  return (
    <section id="products" className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">
        منتجاتنا المميزة
      </h2>

      <Card className="mb-10 shadow-lg border-border bg-card text-card-foreground rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-accent" />
            هل تحتاج إلى مساعدة في الاختيار؟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-lg">
            أخبرنا عن ذوقك المفضل (مثال: "قهوة قوية ومرة" أو "نكهات فاكهية خفيفة") وسنقترح عليك بعض الخيارات!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              type="text"
              value={tasteProfileInput}
              onChange={(e) => setTasteProfileInput(e.target.value)}
              placeholder="صف نوع القهوة التي تفضلها..."
              className="flex-grow p-3 text-base border-input focus:ring-primary"
              onKeyPress={(e) => { if (e.key === 'Enter') handleFetchRecommendations(); }}
            />
            <Button
              onClick={handleFetchRecommendations}
              disabled={isLoadingRecommendations}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3"
            >
              {isLoadingRecommendations ? (
                <>
                  <Search className="me-2 h-5 w-5 animate-pulse" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="me-2 h-5 w-5" />
                  ابحث عن توصية
                </>
              )}
            </Button>
          </div>

          {isLoadingRecommendations && (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center space-x-3 rtl:space-x-reverse p-4 border border-border rounded-lg bg-background animate-pulse">
                  <Skeleton className="h-12 w-12 rounded-full bg-muted" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {recommendationError && (
            <div className="p-4 my-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {recommendationError}
            </div>
          )}

          {recommendations && !isLoadingRecommendations && (
            <div className="space-y-4 mt-6">
              <h4 className="text-xl font-semibold text-primary mb-2">توصياتنا لك:</h4>
              {recommendations.map((rec, index) => (
                <Card 
                  key={index} 
                  className={`bg-background border-border hover:shadow-md transition-shadow cursor-pointer ${rec.productId === 'N/A' ? 'opacity-70' : ''}`}
                  onClick={() => handleRecommendationClick(rec.productId)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-2 bg-accent/20 rounded-full">
                       <Coffee className="h-7 w-7 text-accent" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="text-lg font-semibold text-foreground">{rec.productName}</h5>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProductList />
    </section>
  );
}
