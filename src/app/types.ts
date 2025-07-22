export type InningPosition = 'top' | 'bottom';

export type TeamVisitationType = 'home' | 'away';

export type TeamFieldingType = 'offense' | 'defense';

export type CountType = 'strike' | 'ball' | 'foul' | 'out' | 'score';

export enum CountTypes {
    strike = 'strike',
    ball = 'ball',
    foul = 'foul',
    out = 'out',
    score = 'score',
}

// export type RulesSettings = 'timeRemaining' | 'innings' | 'startingBallCount' | 'startingStrikeCount';

export interface RulesSettings {
    timeRemaining: number,
    innings: number,
    startingBallCount: number,
    startingStrikeCount: number,
    startingFoulCount: number,
    startingOutCount: number,
}

export type InGameUserActionType = CountType | 'inning' | 'inningPosition' | 'resetBallCount' | 'awayTeamScore' | 'homeTeamScore';

export interface InGameUserAction {
    action: InGameUserActionType,
    value: number | string,
    isBulkAction?: boolean,
}

export type EditType = 'undo' | 'redo';
