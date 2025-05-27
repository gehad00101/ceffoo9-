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
  prompt: `أهلاً بك {{username}}! 👋 نتمنى لك تجربة تسوق ممتعة في متجر القهوة الفاخرة. اكتشف مجموعتنا المميزة من أجود أنواع البن واستمتع بأفضل قهوة على الإطلاق.`, // Already personalized in arabic
});

const generateWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'generateWelcomeMessageFlow',
    inputSchema: WelcomeMessageInputSchema,
    outputSchema: WelcomeMessageOutputSchema,
  },
  async input => {
    const {output} = await welcomeMessagePrompt(input);
    return output!;
  }
);
