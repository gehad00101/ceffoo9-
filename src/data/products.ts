
import type { Product, Testimonial } from '@/types';

export const products: Product[] = [
  {
    id: 'dummy001',
    name: 'قهوة الصباح المنعشة',
    price: 50,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'morning coffee',
    description: 'ابدأ يومك بنشاط مع هذا المزيج المنعش من حبوب الأرابيكا الفاخرة.',
    fullDescription: 'قهوة الصباح المنعشة هي الخيار المثالي لبداية يوم مليء بالحيوية. تتميز بمزيج متوازن من حبوب الأرابيكا عالية الجودة، المحمصة بعناية لإبراز نكهات الحمضيات الخفيفة والقوام الناعم. مثالية للتحضير بالتقطير أو الفرنش برس.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة مختصة',
  },
  {
    id: 'dummy002',
    name: 'خلطة المساء الدافئة',
    price: 60,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'evening blend',
    description: 'استرخِ في المساء مع هذه الخلطة الدافئة والغنية بنكهات الكاكاو والتوابل.',
    fullDescription: 'خلطة المساء الدافئة مصممة خصيصًا للاسترخاء بعد يوم طويل. تتميز بمزيج من حبوب البن الداكنة مع لمسات من الكاكاو والقرفة، مما يمنحها طابعًا دافئًا ومريحًا. مثالية للاستمتاع بها مع قطعة حلوى أو بمفردها.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'خلطات خاصة',
  },
  {
    id: 'dummy003',
    name: 'حبوب روبوستا القوية',
    price: 45,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'robusta beans',
    description: 'لعشاق النكهة القوية والمرارة المميزة، حبوب روبوستا نقية ذات تركيز عالٍ.',
    fullDescription: 'حبوب روبوستا القوية تقدم تجربة قهوة مكثفة وجريئة. تتميز هذه الحبوب بمحتواها العالي من الكافيين ونكهتها القوية التي تميل إلى المرارة، مع قوام غني. مثالية لمن يبحثون عن دفعة قوية من الطاقة أو كأساس لمشروبات الإسبريسو القوية.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'حبوب كاملة',
  },
  {
    id: 'dummy004',
    name: 'قهوة عضوية منزوعة الكافيين',
    price: 75,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'decaf organic',
    description: 'استمتع بنكهة القهوة الغنية بدون كافيين، معتمدة كمنتج عضوي.',
    fullDescription: 'قهوتنا العضوية منزوعة الكافيين تقدم لك كل متعة القهوة دون التأثيرات المنبهة للكافيين. يتم نزع الكافيين بطرق طبيعية للحفاظ على النكهات الأصلية للبن. هذا المنتج معتمد كمنتج عضوي، مما يضمن خلوه من المبيدات والمواد الكيميائية. مثالية لأي وقت من اليوم.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة منزوعة الكافيين',
  },
  {
    id: 'dummy005',
    name: 'قهوة إثيوبية ييرغاتشيف',
    price: 85,
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'ethiopian yirgacheffe',
    description: 'نكهات زهرية وفاكهية مميزة من قلب إثيوبيا، مثالية للتقطير.',
    fullDescription: 'قهوة إثيوبية ييرغاتشيف هي جوهرة حقيقية في عالم القهوة المختصة. تُزرع على ارتفاعات عالية وتُعالج بعناية، وتتميز بنكهات زهرية معقدة تذكرنا بالياسمين والبرغموت، مع حموضة ليمونية مشرقة وقوام يشبه الشاي. تجربة فريدة لكل محبي القهوة.',
    additionalImages: [
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png',
      'https://placehold.co/400x300.png'
    ],
    category: 'قهوة مختصة',
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "أفضل قهوة تذوقتها على الإطلاق! الجودة لا تضاهى والتوصيل سريع جداً.",
    author: "سارة أ.",
    location: "الرياض"
  },
  {
    quote: "مجموعة رائعة من القهوة، وكل نوع له نكهته الخاصة. أنصح به بشدة!",
    author: "أحمد م.",
    location: "جدة"
  },
  {
    quote: "خدمة عملاء ممتازة ومنتجات فاخرة. سأعود للشراء مرة أخرى بالتأكيد.",
    author: "فاطمة خ.",
    location: "الدمام"
  },
  {
    quote: "قهوة المساء الدافئة أصبحت جزءاً لا يتجزأ من روتيني اليومي. طعم رائع!",
    author: "علي ح.",
    location: "مكة المكرمة"
  }
];
