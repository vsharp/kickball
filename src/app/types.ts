export type InningPosition = 'top' | 'bottom';

export enum InningPositions {
  top = 'top',
  bottom = 'bottom',
}

export type TeamVisitationType = 'home' | 'away';

export enum TeamVisitationTypes {
  home = 'home',
  away = 'away',
}

export type TeamFieldingType = 'offense' | 'defense';

export enum TeamFieldingTypes {
  offense = 'offense',
  defense = 'defense',
}

export type CountType = 'strike' | 'ball' | 'foul' | 'out' | 'score';

export enum CountTypes {
    strike = 'strike',
    ball = 'ball',
    foul = 'foul',
    out = 'out',
    inning = 'inning',
    inningPosition = 'inningPosition',
    score = 'score',
    awayTeamScore = 'awayTeamScore',
    homeTeamScore = 'homeTeamScore',
}

export interface RulesSettings {
    timeRemaining: number,
    innings: number,
    startingBallCount: number,
    startingStrikeCount: number,
    startingFoulCount: number,
    startingOutCount: number,
    maxBallCount: number,
    maxStrikeCount: number,
    maxFoulCount: number,
    hasUnlimitedFouls: boolean,
    maxOutCount: number,
}

export type InGameUserActionType = CountType | 'inning' | 'inningPosition' | 'resetBallCount' | 'awayTeamScore' | 'homeTeamScore';

export interface InGameUserAction {
    action: InGameUserActionType,
    value: number | string,
    isBulkAction?: boolean,
}

export type EditType = 'undo' | 'redo';

export enum EditTypes {
  undo = 'undo',
  redo = 'redo',
}

export interface TeamInfo {
  id: number;
  name: string;
  color: string;
}

export interface TeamsListing {
  teams: TeamInfo[];
}
