import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="bg-amber-50 py-12 px-4 rounded-lg shadow-inner mx-auto container">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="md:w-1/2">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="صورة عن المتجر" 
            width={600}
            height={400}
            className="w-full h-auto rounded-xl shadow-lg object-cover"
            data-ai-hint="coffee shop interior"
            />
        </div>
        <div className="md:w-1/2 text-center md:text-right">
          <h2 className="text-4xl font-bold mb-6 text-primary">قصتنا</h2>
          <p className="text-lg text-foreground/90 leading-relaxed mb-4">
            في متجر القهوة الفاخرة، نؤمن بأن القهوة ليست مجرد مشروب، بل هي تجربة.
            بدأت قصتنا بشغف عميق بالبن الفاخر ورغبة في مشاركة هذه التجربة الفريدة مع العالم.
            نحن نسافر حول العالم لاكتشاف أجود أنواع حبوب البن، ونعمل مع مزارعين ملتزمين بالجودة والاستدامة.
          </p>
          <p className="text-lg text-foreground/90 leading-relaxed">
            كل حبة بن يتم تحميصها بعناية فائقة هنا في منشآتنا لضمان وصول النكهة الكاملة والعطر الغني إلى فنجانك.
            سواء كنت تفضل الإسبريسو القوي، أو القهوة العربية الأصيلة، أو القهوة المقطرة،
            فإننا نعدك بتجربة لا تُنسى مع كل رشفة.
          </p>
        </div>
      </div>
    </section>
  );
}
