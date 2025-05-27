import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'prod001',
    name: 'قهوة عربية أصيلة',
    price: 65,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'arabic coffee',
    description: 'مزيج فريد من أجود حبوب البن العربي، محمصة بعناية لتقديم نكهة غنية ومميزة. مثالية للضيافة اليومية.',
    fullDescription: 'قهوتنا العربية الأصيلة يتم اختيار حبوبها بعناية فائقة من أفضل المزارع في المنطقة. يتم تحميصها على دفعات صغيرة لضمان أقصى درجات النضارة والنكهة. مثالية لتحضير القهوة السعودية التقليدية، وتقدم تجربة فريدة من نوعها لمحبي القهوة الأصيلة. خالية من الإضافات الصناعية وتأتي في عبوة محكمة الإغلاق للحفاظ على الطزاجة.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة عربية',
  },
  {
    id: 'prod002',
    name: 'حبوب إسبريسو فاخرة',
    price: 79,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'espresso beans',
    description: 'حبوب بن مختارة بعناية لتحضير أفضل كوب إسبريسو، بقوام كريمي ونكهة قوية.',
    fullDescription: 'استمتع بتجربة الإسبريسو المثالية مع حبوبنا الفاخرة، المختارة بعناية من أفضل مزارع البن في أمريكا اللاتينية. تتميز هذه الحبوب بنكهة قوية وغنية مع لمسات من الشوكولاتة الداكنة والمكسرات. مثالية لماكينات الإسبريسو، وتنتج كريما غنية تدوم طويلاً. مثالية لتحضير اللاتيه والكابتشينو.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'إسبريسو',
  },
  {
    id: 'prod003',
    name: 'قهوة تركية تقليدية',
    price: 55,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'turkish coffee',
    description: 'بن تركي مطحون بدقة، مثالي لتحضير القهوة التركية الغنية بالرغوة والنكهة العميقة.',
    fullDescription: 'قهوتنا التركية التقليدية مطحونة بدقة فائقة لتقديم تجربة قهوة غنية ومكثفة. مستوحاة من الوصفات العثمانية القديمة، هذه القهوة مثالية للتحضير في الركوة، وتتميز برغوة كثيفة ونكهة عميقة تدوم طويلاً. مثالية للطقوس اليومية ومشاركتها مع الأصدقاء.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة تركية',
  },
  {
    id: 'prod004',
    name: 'قهوة مقطرة كولومبية',
    price: 70,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'colombian coffee',
    description: 'حبوب بن كولومبية فاخرة، مثالية للتقطير، تتميز بنكهة متوازنة وحموضة خفيفة.',
    fullDescription: 'اكتشف النكهات المشرقة والمتوازنة لقهوتنا الكولومبية المقطرة. يتم اختيار هذه الحبوب من المرتفعات الكولومبية، وهي مثالية لطرق التحضير بالتقطير مثل V60 أو Chemex. تتميز بحموضة خفيفة وقوام ناعم مع نكهات الفاكهة الاستوائية والكراميل. تجربة منعشة ومثالية للصباح.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة مقطرة',
  }
];

export const testimonials = [
  {
    quote: "أفضل قهوة تذوقتها على الإطلاق! الجودة لا تضاهى والتوصيل سريع جداً.",
    author: "سارة أ.",
    location: "الرياض"
  },
  {
    quote: "مجموعة رائعة من القهوة، وكل نوع له نكهته الخاصة. أنصح به بشدة!",
    author: "أحمد م.",
    location: "جدة"
  }
];
