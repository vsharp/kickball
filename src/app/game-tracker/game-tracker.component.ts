import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TickerComponent, TickerClickData } from '../ticker/ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { MatButtonModule } from '@angular/material/button';
import { TimeRemainingPipe } from '../pipes/time-remaining.pipe';
import { SettingsService } from "../services/settings.service";
import { EditsTrackerService } from "../services/edits-tracker.service";
import { CountTypes, EditType, InGameUserAction, InGameUserActionType } from "../types";

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

  timeRemainingId!: NodeJS.Timeout;

  //configurable settings
  public timeRemaining = 2700000; //2700000 = 45min
  maxInnings = 5;
  startingBallCount = 0;
  startingStrikeCount = 0;

  settingsService = inject(SettingsService);
  editsService = inject(EditsTrackerService);

  constructor() {
    this.maxInnings = this.settingsService.getInnings();
    this.timeRemaining = this.settingsService.getTimeRemaining();
    this.startingBallCount = this.settingsService.getStartingBallCount();
    this.startingStrikeCount = this.settingsService.getStartingStrikeCount();

    this.resetPitchCount();
  }

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
      case "ball":
        if (this.currentBallsCount >= 3) {
          this.resetPitchCount();
        } else {
          this.currentBallsCount += 1;
        }
        this.editsService.pushAction('ball', 1);
        break;
      case "strike":
        if (this.currentStrikesCount >= 2) {
          this.resetPitchCount();
          this.editsService.pushAction('strike', 1);
          if (this.currentNumberOfOuts < 2) {
            this.currentNumberOfOuts += 1;
            this.editsService.pushAction('out', 1);
          } else {
            this.goToNextInning();
          }
        } else {
          this.currentStrikesCount += 1;
          this.editsService.pushAction('strike', 1);
        }
        break;
      case "foul":
        if (this.currentFoulsCount >= 3) {
          this.resetPitchCount();
          this.editsService.pushAction('foul', 1);
          if (this.currentNumberOfOuts < 2) {
            this.currentNumberOfOuts += 1;
            this.editsService.pushAction('foul', 1);
          } else {
            this.goToNextInning();
          }
        } else {
          this.currentFoulsCount += 1;
          this.editsService.pushAction('foul', 1);
        }
        break;
      case "out":
        if (this.currentNumberOfOuts >= 2) {
          this.resetPitchCount();
          this.goToNextInning();
        } else {
          this.currentNumberOfOuts += 1;
        }
        this.editsService.pushAction('out', 1);
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
    this.currentBallsCount = this.startingBallCount;
    this.currentStrikesCount = this.startingStrikeCount;
    this.currentFoulsCount = 0;
  }

  offenseScored() {
    if (this.inningPosition === 'top') {
      this.awayTeamScore += 1;
    } else {
      this.homeTeamScore += 1;
    }
    this.editsService.pushAction('score', 1);
  }

  handleEdits(editType: EditType) {
    const userAction = this.editsService.traverseActions(editType);
    let incrementBy = 1;
    console.log('action', userAction);
    if (!userAction) {
      return;
    }

    if (editType === 'undo') {
      incrementBy = -1;
    }

    switch (userAction.action) {
      case 'score':
        if (this.inningPosition === 'top') {
          this.awayTeamScore += incrementBy;
        } else {
          this.homeTeamScore += incrementBy;
        }
        break;
      case 'ball':
        this.currentBallsCount += userAction.value * incrementBy;
        break;
      case 'strike':
        this.currentStrikesCount += userAction.value * incrementBy;
        break;
      case 'foul':
        this.currentFoulsCount += userAction.value * incrementBy;
        break;
      case 'out':
        this.currentNumberOfOuts += userAction.value * incrementBy;
        break;
      default:
        break;
    }
  }
}
