import { testimonials } from '@/data/products'; // Assuming testimonials are in products.ts
import { Card, CardContent } from '@/components/ui/card';

export default function TestimonialsSection() {
  return (
    <section className="bg-amber-700 text-white py-12 px-4 mt-12 rounded-lg shadow-lg mx-auto container">
      <h2 className="text-4xl font-bold text-center mb-8">ماذا يقول عملاؤنا؟</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-background text-foreground p-6 rounded-xl shadow-md">
            <CardContent className="p-0">
              <p className="italic mb-4 text-lg">"{testimonial.quote}"</p>
              <p className="font-semibold text-primary">- {testimonial.author}، {testimonial.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}