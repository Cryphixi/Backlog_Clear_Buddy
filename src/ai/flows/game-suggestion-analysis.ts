// src/ai/flows/game-suggestion-analysis.ts
'use server';

/**
 * @fileOverview Analyzes a user's Steam library and schedule to suggest games to play.
 *
 * - analyzeGamesAndSuggest - A function that takes Steam library data and a user schedule to recommend games.
 * - GameSuggestionInput - The input type for the analyzeGamesAndSuggest function.
 * - GameSuggestionOutput - The return type for the analyzeGamesAndSuggest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the game suggestion flow
const GameSuggestionInputSchema = z.object({
  steamLibraryData: z.string().describe('JSON string of the user\u0027s Steam game library data, including game titles and total playtime in hours.'),
  userSchedule: z.string().describe('JSON string of the user\u0027s weekly schedule, including available time slots for gaming.'),
});
export type GameSuggestionInput = z.infer<typeof GameSuggestionInputSchema>;

// Output schema for the game suggestion flow
const GameSuggestionOutputSchema = z.object({
  suggestedGames: z.array(
    z.object({
      gameTitle: z.string().describe('The title of the suggested game.'),
      reason: z.string().describe('The reason why this game was suggested based on the user\u0027s schedule and play style.'),
    })
  ).describe('A list of games suggested for the user to play.'),
});
export type GameSuggestionOutput = z.infer<typeof GameSuggestionOutputSchema>;

// Exported function to analyze games and suggest
export async function analyzeGamesAndSuggest(input: GameSuggestionInput): Promise<GameSuggestionOutput> {
  return analyzeGamesAndSuggestFlow(input);
}

// Prompt definition
const gameSuggestionPrompt = ai.definePrompt({
  name: 'gameSuggestionPrompt',
  input: {schema: GameSuggestionInputSchema},
  output: {schema: GameSuggestionOutputSchema},
  prompt: `You are a personal gaming assistant. Analyze the user's Steam game library and their schedule to suggest games from their library that they can play.

Consider the user's available time slots and their game play style (based on total playtime) to provide personalized game recommendations.

Only suggest games that are in the user's Steam library. Do not suggest games that the user does not own.

Steam Library Data: {{{steamLibraryData}}}
User Schedule: {{{userSchedule}}}

Based on this information, which games would you recommend and why?

Format your response as a JSON object with a 'suggestedGames' array. Each object in the array should have 'gameTitle' and 'reason' fields.
`,  
});

// Flow definition
const analyzeGamesAndSuggestFlow = ai.defineFlow(
  {
    name: 'analyzeGamesAndSuggestFlow',
    inputSchema: GameSuggestionInputSchema,
    outputSchema: GameSuggestionOutputSchema,
  },
  async input => {
    const {output} = await gameSuggestionPrompt(input);
    return output!;
  }
);
