'use server';

/**
 * @fileOverview A game information scraper AI agent.
 *
 * - scrapeGameInfo - A function that handles the game information scraping process.
 * - ScrapeGameInfoInput - The input type for the scrapeGameInfo function.
 * - ScrapeGameInfoOutput - The return type for the scrapeGameInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScrapeGameInfoInputSchema = z.object({
  gameTitle: z.string().describe('The title of the game to scrape information for.'),
});
export type ScrapeGameInfoInput = z.infer<typeof ScrapeGameInfoInputSchema>;

const ScrapeGameInfoOutputSchema = z.object({
  gameDetails: z
    .string()
    .describe('Detailed information about the game, including genre, play styles, and average playtimes.'),
});
export type ScrapeGameInfoOutput = z.infer<typeof ScrapeGameInfoOutputSchema>;

export async function scrapeGameInfo(input: ScrapeGameInfoInput): Promise<ScrapeGameInfoOutput> {
  return scrapeGameInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scrapeGameInfoPrompt',
  input: {schema: ScrapeGameInfoInputSchema},
  output: {schema: ScrapeGameInfoOutputSchema},
  prompt: `You are an expert web scraper specializing in gathering information about video games.

You will scrape the web to find detailed information about the game, including its genre, play styles, average playtimes, and any other relevant details.

Game Title: {{{gameTitle}}}

Return the scraped information in a detailed and comprehensive manner.
`,
});

const scrapeGameInfoFlow = ai.defineFlow(
  {
    name: 'scrapeGameInfoFlow',
    inputSchema: ScrapeGameInfoInputSchema,
    outputSchema: ScrapeGameInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
