
import ProductList from '@/components/product/ProductList';

export default function ProductsSection() {
  return (
    <section id="products" className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">
        منتجاتنا المميزة
      </h2>
      <ProductList />
    </section>
  );
}
