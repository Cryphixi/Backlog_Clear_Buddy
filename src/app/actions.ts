'use server';

import { analyzeGamesAndSuggest, GameSuggestionInput, GameSuggestionOutput } from '@/ai/flows/game-suggestion-analysis';
import { scrapeGameInfo, ScrapeGameInfoInput, ScrapeGameInfoOutput } from '@/ai/flows/game-information-scraper';

// Mocked Steam library data. In a real application, this would be fetched from the Steam API.
const MOCK_STEAM_LIBRARY = JSON.stringify([
    { gameTitle: "Cyberpunk 2077", playtime: 80, lastPlayed: "2024-05-01" },
    { gameTitle: "Baldur's Gate 3", playtime: 120, lastPlayed: "2024-04-15" },
    { gameTitle: "Stardew Valley", playtime: 200, lastPlayed: "2024-05-10" },
    { gameTitle: "Elden Ring", playtime: 150, lastPlayed: "2024-03-20" },
    { gameTitle: "Hades", playtime: 60, lastPlayed: "2024-05-05" },
    { gameTitle: "The Witcher 3: Wild Hunt", playtime: 5, lastPlayed: "2023-01-01" },
    { gameTitle: "Portal 2", playtime: 2, lastPlayed: "2022-01-01" },
    { gameTitle: "Dave the Diver", playtime: 25, lastPlayed: "2024-05-12"},
    { gameTitle: "Helldivers 2", playtime: 45, lastPlayed: "2024-05-11"}
]);

export async function getGameRecommendationsAction(userSchedule: string): Promise<GameSuggestionOutput> {
  if (!userSchedule || userSchedule === '{}') {
    throw new Error("Please select at least one available time slot in your schedule.");
  }
  
  try {
    const input: GameSuggestionInput = {
      steamLibraryData: MOCK_STEAM_LIBRARY,
      userSchedule: userSchedule,
    };
    const recommendations = await analyzeGamesAndSuggest(input);
    if (!recommendations.suggestedGames || recommendations.suggestedGames.length === 0) {
      return { suggestedGames: [] };
    }
    return recommendations;
  } catch (error) {
    console.error("Error getting game recommendations:", error);
    throw new Error("Failed to get game recommendations from AI. Please try again.");
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
