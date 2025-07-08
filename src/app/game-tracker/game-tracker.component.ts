import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ScoreTickerComponent } from '../score-ticker/score-ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { MatButtonModule } from '@angular/material/button';
import { TimeRemainingPipe } from '../time-remaining.pipe';

@Component({
  selector: 'app-game-tracker',
  imports: [MatIconModule, ScoreTickerComponent, InningTickerComponent, MatButtonModule, TimeRemainingPipe],
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
  public timeRemaining = 2700000;

  timeRemainingId!: NodeJS.Timeout;

  constructor() {}

  toggleTimeRemaining() {
    if (this.timeRemainingId) {
      clearInterval(this.timeRemainingId);
    } else {
      this.timeRemainingId = setInterval(() => {
        this.timeRemaining -= 1000;
      }, 1000);
    }
  }
}
