import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TickerComponent, TickerClickData } from '../ticker/ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { MatButtonModule } from '@angular/material/button';
import { TimeRemainingPipe } from '../time-remaining.pipe';

@Component({
  selector: 'app-game-tracker',
  imports: [MatIconModule, TickerComponent, InningTickerComponent, MatButtonModule, TimeRemainingPipe],
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
  public currentNumberOfOuts = 0;
  public timeRemaining = 2700000;

  timeRemainingId!: NodeJS.Timeout;
  maxInnings = 5;
  maxTimeLimit = 2700000; //2700000 = 45min

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

  onScoreClick(data: TickerClickData) {
    if (data.currentTeamFieldingType === 'offense') {
      this.offenseScored();
    }
  }

  onTickerClick(data: TickerClickData) {
    let countType = data.countType;
    switch (countType) {
      case "balls":
        if (this.currentBallsCount >= 3) {
          this.resetPitchCount();
        } else {
          this.currentBallsCount += 1;
        }
        break;
      case "strikes":
        if (this.currentStrikesCount >= 2) {
          this.resetPitchCount();
          if (this.currentNumberOfOuts < 2) {
            this.currentNumberOfOuts += 1;
          } else {
            this.goToNextInning();
          }
        } else {
          this.currentStrikesCount += 1;
        }
        break;
      case "fouls":
        if (this.currentFoulsCount >= 3) {
          this.resetPitchCount();
          if (this.currentNumberOfOuts < 2) {
            this.currentNumberOfOuts += 1;
          } else {
            this.goToNextInning();
          }
        } else {
          this.currentFoulsCount += 1;
        }
        break;
      case "outs":
        if (this.currentNumberOfOuts >= 2) {
          this.resetPitchCount();
          this.goToNextInning();
        } else {
          this.currentNumberOfOuts += 1;
        }
    }
  }

  goToNextInning() {
    this.inningPosition = this.inningPosition === 'bottom' ? 'top' : 'bottom';
    if (this.inningPosition === 'top' ) {
      this.currentInning++;
    }
    this.currentNumberOfOuts = 0;
  }

  onRunnerScored() {
    this.resetPitchCount();
    this.offenseScored();
  }

  onKickerSafe() {
    this.resetPitchCount();
  }

  resetPitchCount() {
    this.currentBallsCount = 0;
    this.currentStrikesCount = 0;
    this.currentFoulsCount = 0;
  }

  offenseScored() {
    if (this.inningPosition === 'top') {
      this.awayTeamScore += 1;
    } else {
      this.homeTeamScore += 1;
    }
  }
}
