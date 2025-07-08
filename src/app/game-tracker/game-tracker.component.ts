import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ScoreTickerComponent } from '../score-ticker/score-ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-tracker',
  imports: [MatIconModule, ScoreTickerComponent, InningTickerComponent, MatButtonModule],
  templateUrl: './game-tracker.component.html',
  styleUrl: './game-tracker.component.scss'
})
export class GameTrackerComponent {
  public awayTeamScore = 0;
  public homeTeamScore = 0;
  public inningPosition: 'top' | 'bottom' = 'top';
  public currentInning = 1;
  public currentBallsCount = 0;
  public currentStrikesCount = 0;
  public currentFoulsCount = 0;
  public numberOfOuts = 0;
  public timeRemaining = 162000;

  constructor() {}


}
