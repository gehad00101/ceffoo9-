
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { products as allProducts } from '@/data/products';
import type { Product } from '@/types';

export default function CoffeeSelectionPage() {
  const coffeeProducts: Product[] = allProducts.filter(
    (product) => product.category !== 'أدوات القهوة'
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">
          مختارات القهوة
        </h1>
        {coffeeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coffeeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-foreground/70">
            لا توجد منتجات قهوة لعرضها حالياً.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
