export type SuggestedGame = {
  gameTitle: string;
  reason: string;
};

export type Schedule = {
  [day: string]: {
    [hour: number]: boolean;
  };
};

// Types for Steam API responses

// From GetPlayerSummaries
export interface Player {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
    loccountrycode?: string;
    locstatecode?: string;
    loccityid?: number;
}

export interface GetPlayerSummariesResponse {
    response: {
        players: Player[];
    };
}

// From GetOwnedGames
export interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
    rtime_last_played: number;
    playtime_disconnected: number;
}

export interface GetOwnedGamesResponse {
    response: {
        game_count: number;
        games: Game[];
    };
}

// From GetRecentlyPlayedGames
export interface RecentlyPlayedGame extends Game {
    playtime_2weeks: number;
}

export interface GetRecentlyPlayedGamesResponse {
    response: {
        total_count: number;
        games: RecentlyPlayedGame[];
    }
}
