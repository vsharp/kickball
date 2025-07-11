export type InningPosition = 'top' | 'bottom';

export type TeamVisitationType = 'home' | 'away';

export type TeamFieldingType = 'offense' | 'defense';

export type CountType = 'strikes' | 'balls' | 'fouls' | 'outs' | 'scores';

// export type RulesSettings = 'timeRemaining' | 'innings' | 'startingBallCount' | 'startingStrikeCount';

export interface RulesSettings {
    timeRemaining: number,
    innings: number,
    startingBallCount: number,
    startingStrikeCount: number,
}
