'use server';

import type { GetOwnedGamesResponse, Game, GetPlayerSummariesResponse, Player, GetRecentlyPlayedGamesResponse, RecentlyPlayedGame } from '@/lib/types';

const API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = 'https://api.steampowered.com';

if (!API_KEY) {
    console.warn("STEAM_API_KEY environment variable is not set. Steam API calls will fail.");
}

async function steamApiFetch(path: string, params: URLSearchParams): Promise<any> {
    if (!API_KEY) {
        throw new Error('Steam API key is not configured.');
    }
    params.set('key', API_KEY);
    const url = `${BASE_URL}/${path}?${params.toString()}`;

    try {
        const response = await fetch(url, { cache: 'no-store' }); // Use no-store to ensure fresh data
        if (!response.ok) {
            throw new Error(`Steam API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (Object.keys(data.response).length === 0) {
            // This often indicates a private profile when no games/summaries are returned.
            throw new Error("Failed to fetch data. The user's profile may be private.");
        }
        return data;
    } catch (error) {
        console.error(`Steam API Error fetching ${url}:`, error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

/**
 * Fetches the list of games a user owns.
 * @param steamId The user's 64-bit Steam ID.
 * @returns A promise that resolves to an array of Game objects.
 */
export async function getOwnedGames(steamId: string): Promise<Game[]> {
    const params = new URLSearchParams({
        steamid: steamId,
        include_appinfo: 'true',
        format: 'json',
    });
    const data: GetOwnedGamesResponse = await steamApiFetch('IPlayerService/GetOwnedGames/v1/', params);
    return data.response.games || [];
}

/**
 * Fetches the public summary of a player's Steam profile.
 * @param steamId The user's 64-bit Steam ID.
 * @returns A promise that resolves to a Player object, or null if not found.
 */
export async function getPlayerSummary(steamId: string): Promise<Player | null> {
    const params = new URLSearchParams({
        steamids: steamId,
        format: 'json',
    });
    const data: GetPlayerSummariesResponse = await steamApiFetch('ISteamUser/GetPlayerSummaries/v2/', params);
    return data.response.players?.[0] || null;
}

/**
 * Fetches the recently played games for a user.
 * @param steamId The user's 64-bit Steam ID.
 * @param count The number of recent games to return.
 * @returns A promise that resolves to an array of RecentlyPlayedGame objects.
 */
export async function getRecentlyPlayedGames(steamId: string, count = 20): Promise<RecentlyPlayedGame[]> {
    const params = new URLSearchParams({
        steamid: steamId,
        count: count.toString(),
        format: 'json',
    });
    const data: GetRecentlyPlayedGamesResponse = await steamApiFetch('IPlayerService/GetRecentlyPlayedGames/v1/', params);
    return data.response.games || [];
}
