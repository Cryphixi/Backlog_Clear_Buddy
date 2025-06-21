export type SuggestedGame = {
  gameTitle: string;
  reason: string;
};

export type Schedule = {
  [day: string]: {
    [hour: number]: boolean;
  };
};
