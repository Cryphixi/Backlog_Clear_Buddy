'use server';

import { analyzeGamesAndSuggest, GameSuggestionInput, GameSuggestionOutput } from '@/ai/flows/game-suggestion-analysis';
import { scrapeGameInfo, ScrapeGameInfoInput, ScrapeGameInfoOutput } from '@/ai/flows/game-information-scraper';
import { getOwnedGames, getPlayerSummary } from '@/services/steam';
import type { Player } from '@/lib/types';


export async function getPlayerSummaryAction(steamId: string | null): Promise<Player | null> {
    if (!steamId) {
        throw new Error("Steam ID is required.");
    }
    try {
        const summary = await getPlayerSummary(steamId);
        return summary;
    } catch (error: any) {
        console.error("Error getting player summary:", error);
        // Return a specific error message or a generic one
        if (error.message.includes('profile is private')) {
            throw new Error("Could not fetch profile. The user's profile may be private.");
        }
        throw new Error("Failed to get player summary from Steam. Please check the Steam ID and try again.");
    }
}


export async function getGameRecommendationsAction(steamId: string | null, userSchedule: string): Promise<GameSuggestionOutput> {
  if (!steamId) {
    throw new Error("Steam ID is required to get game recommendations.");
  }
  if (!userSchedule || userSchedule === '{}') {
    throw new Error("Please select at least one available time slot in your schedule.");
  }
  
  try {
    const ownedGames = await getOwnedGames(steamId);
    
    // Filter out games without a name and map to the format expected by the AI
    const libraryForAI = ownedGames
        .filter(game => game.name)
        .map(game => ({
            gameTitle: game.name,
            playtimeInHours: Math.round(game.playtime_forever / 60),
        }));

    if (libraryForAI.length === 0) {
        return { suggestedGames: [] };
    }

    const input: GameSuggestionInput = {
      steamLibraryData: JSON.stringify(libraryForAI),
      userSchedule: userSchedule,
    };
    
    const recommendations = await analyzeGamesAndSuggest(input);
    if (!recommendations.suggestedGames || recommendations.suggestedGames.length === 0) {
      return { suggestedGames: [] };
    }
    return recommendations;
  } catch (error: any) {
    console.error("Error getting game recommendations:", error);
    if (error.message.includes('private')) {
        throw new Error("Could not fetch game library. The user's profile or game details may be private.");
    }
    throw new Error("Failed to get game recommendations. Please check your Steam API Key and Steam ID.");
  }
}

export async function getGameDetails(gameTitle: string): Promise<ScrapeGameInfoOutput> {
    const input: ScrapeGameInfoInput = { gameTitle };
    try {
        const details = await scrapeGameInfo(input);
        return details;
    } catch(error) {
        console.error("Error getting game details:", error);
        return { gameDetails: "Could not retrieve details for this game." };
    }
}
