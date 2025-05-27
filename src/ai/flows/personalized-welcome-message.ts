
'use server';

/**
 * @fileOverview A personalized welcome message generator flow.
 *
 * - generateWelcomeMessage - A function that generates a personalized welcome message.
 * - WelcomeMessageInput - The input type for the generateWelcomeMessage function.
 * - WelcomeMessageOutput - The return type for the generateWelcomeMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WelcomeMessageInputSchema = z.object({
  username: z.string().describe('The username of the logged-in user.'),
});
export type WelcomeMessageInput = z.infer<typeof WelcomeMessageInputSchema>;

const WelcomeMessageOutputSchema = z.object({
  message: z.string().describe('The personalized welcome message.'),
});
export type WelcomeMessageOutput = z.infer<typeof WelcomeMessageOutputSchema>;

export async function generateWelcomeMessage(
  input: WelcomeMessageInput
): Promise<WelcomeMessageOutput> {
  return generateWelcomeMessageFlow(input);
}

const welcomeMessagePrompt = ai.definePrompt({
  name: 'welcomeMessagePrompt',
  input: {schema: WelcomeMessageInputSchema},
  output: {schema: WelcomeMessageOutputSchema},
  prompt: `أنت مساعد ترحيبي في "متجر القهوة الفاخرة". قم بصياغة رسالة ترحيب شخصية ودافئة للمستخدم "{{username}}".
يجب أن تكون الرسالة باللغة العربية، قصيرة، ودودة، ومشجعة على استكشاف تشكيلة القهوة المميزة لدينا.
مثال للأسلوب: "أهلاً بك يا {{username}} في متجرنا! نتمنى لك رحلة ممتعة بين نكهات القهوة الساحرة."
أو "يا هلا بك {{username}}! سعيدون بوجودك. اكتشف قهوتك المفضلة اليوم."
حافظ على نبرة إيجابية ومرحبة.`,
});

const generateWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'generateWelcomeMessageFlow',
    inputSchema: WelcomeMessageInputSchema,
    outputSchema: WelcomeMessageOutputSchema,
  },
  async input => {
    const {output} = await welcomeMessagePrompt(input);
    if (!output || !output.message) {
      // Fallback message if the LLM fails or returns an empty message
      return { message: `أهلاً وسهلاً بك، ${input.username}! نتمنى لك يوماً سعيداً.` };
    }
    return output;
  }
);

