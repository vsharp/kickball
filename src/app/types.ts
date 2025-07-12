export type InningPosition = 'top' | 'bottom';

export type TeamVisitationType = 'home' | 'away';

export type TeamFieldingType = 'offense' | 'defense';

export type CountType = 'strike' | 'ball' | 'foul' | 'out' | 'score';

export enum CountTypes {
    strike,
    ball,
    foul,
    out,
    score,
}

// export type RulesSettings = 'timeRemaining' | 'innings' | 'startingBallCount' | 'startingStrikeCount';

export interface RulesSettings {
    timeRemaining: number,
    innings: number,
    startingBallCount: number,
    startingStrikeCount: number,
}

export type InGameUserActionType = CountType & 'inning';

export interface InGameUserAction {
    action: InGameUserActionType,
    value: number,
}

export type EditType = 'undo' | 'redo';
