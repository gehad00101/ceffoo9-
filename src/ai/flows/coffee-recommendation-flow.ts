
'use server';
/**
 * @fileOverview تدفق توصية القهوة باستخدام الذكاء الاصطناعي.
 *
 * - getCoffeeRecommendations - دالة للحصول على توصيات قهوة بناءً على تفضيلات المستخدم.
 * - CoffeeRecommendationInput - نوع الإدخال لدالة getCoffeeRecommendations.
 * - CoffeeRecommendationOutput - نوع الإرجاع لدالة getCoffeeRecommendations.
 */

import {ai} from '@/ai/genkit';
import {products} from '@/data/products';
import type { Product } from '@/types';
import {z} from 'genkit';

const CoffeeRecommendationInputSchema = z.object({
  tasteProfile: z
    .string()
    .describe(
      'ملف تعريف ذوق القهوة المطلوب من المستخدم (مثال: قوي، فاكهي، ناعم، بطعم الشوكولاتة).'
    ),
});
export type CoffeeRecommendationInput = z.infer<
  typeof CoffeeRecommendationInputSchema
>;

const RecommendationSchema = z.object({
  productId: z.string().describe('معرف المنتج للقهوة الموصى بها.'),
  productName: z.string().describe('اسم منتج القهوة الموصى به.'),
  reason: z
    .string()
    .describe('شرح موجز لسبب التوصية بهذه القهوة بناءً على ملف الذوق.'),
});

const CoffeeRecommendationOutputSchema = z.object({
  recommendations: z
    .array(RecommendationSchema)
    .describe('قائمة من 2-3 توصيات قهوة.'),
});
export type CoffeeRecommendationOutput = z.infer<
  typeof CoffeeRecommendationOutputSchema
>;

// Schema for the data passed directly to the prompt, including product list
const PromptInputSchema = z.object({
  tasteProfile: z.string(),
  availableProducts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
    })
  ),
});

export async function getCoffeeRecommendations(
  input: CoffeeRecommendationInput
): Promise<CoffeeRecommendationOutput> {
  return recommendCoffeeFlow(input);
}

const recommendCoffeePrompt = ai.definePrompt({
  name: 'recommendCoffeePromptAr',
  input: {schema: PromptInputSchema},
  output: {schema: CoffeeRecommendationOutputSchema},
  prompt: `أنت خبير قهوة محترف (سوميليه). يبحث مستخدم عن توصيات للقهوة بناءً على تفضيلات ذوقه.
ملف تعريف الذوق المطلوب هو: "{{tasteProfile}}".

إليك قائمة بأنواع القهوة المتوفرة لدينا:
{{#each availableProducts}}
- المنتج: "{{this.name}}" (المعرف: {{this.id}}): {{this.description}} (السعر: {{this.price}} ر.س)
{{/each}}

يرجى التوصية بـ 2-3 أنواع قهوة من القائمة أعلاه تتناسب بشكل أفضل مع ملف تعريف ذوق المستخدم. لكل توصية، قدم معرف المنتج واسم المنتج وسببًا موجزًا.
تأكد من أن توصياتك مأخوذة حصريًا من القائمة المتوفرة.
إذا لم يتطابق أي نوع قهوة بشكل قوي، يمكنك ذكر ذلك أو محاولة إيجاد أقرب الخيارات.
الرد يجب أن يكون باللغة العربية.
`,
});

const recommendCoffeeFlow = ai.defineFlow(
  {
    name: 'recommendCoffeeFlowAr',
    inputSchema: CoffeeRecommendationInputSchema,
    outputSchema: CoffeeRecommendationOutputSchema,
  },
  async flowInput => {
    const productListForPrompt = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description, // Using short description for brevity in prompt
      price: p.price,
    }));

    const promptInputData = {
      tasteProfile: flowInput.tasteProfile,
      availableProducts: productListForPrompt,
    };

    const {output} = await recommendCoffeePrompt(promptInputData);
    if (!output) {
        // Handle cases where the LLM might return nothing or an unexpected format
        // This is a basic fallback, more sophisticated error handling might be needed
        return { recommendations: [{ productId: 'N/A', productName: 'لا توجد توصيات حالية', reason: 'لم نتمكن من العثور على تطابق مثالي في الوقت الحالي. يرجى تجربة وصف آخر أو تصفح منتجاتنا.' }] };
    }
    return output;
  }
);
