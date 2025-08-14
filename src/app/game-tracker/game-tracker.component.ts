import { Component, inject } from '@angular/core';
import { TickerComponent, TickerClickData } from '../ticker/ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { TimeRemainingPipe } from '../pipes/time-remaining.pipe';
import { SettingsService } from "../services/settings.service";
import { EditsTrackerService } from "../services/edits-tracker.service";
import { CountTypes, EditType, InGameUserAction, InGameUserActionType, InningPosition } from "../types";
import { AlertController, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowRedoSharp, arrowUndoSharp, pauseSharp, playSharp, reloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-game-tracker',
  imports: [TickerComponent, InningTickerComponent, TimeRemainingPipe, IonButton, IonIcon, IonFab, IonFabButton],
  templateUrl: './game-tracker.component.html',
  styleUrl: './game-tracker.component.scss'
})
export class GameTrackerComponent {
  public awayTeamScore = 0;
  public homeTeamScore = 0;
  public currentInningPosition: 'top' | 'bottom' = 'top';
  public currentInning = 1;
  public currentBallsCount = 0;
  public currentStrikesCount = 0;
  public currentFoulsCount = 0;
  public currentNumberOfOuts = 0;
  public canUndo = false;
  public canRedo = false;
  public gameInProgress = false;

  public weDebuggingOrNah = false;

  timeRemainingId!: NodeJS.Timeout | null;

  //configurable settings
  public timeRemaining = 2700000; //2700000 = 45min
  //starts
  startingBallCount = 0;
  startingStrikeCount = 0;
  startingFoulCount = 0;
  startingOutCount = 0;
  //maxes
  maxInnings = 5;
  maxBallCount = 4;
  maxStrikeCount = 3;
  maxFoulCount = 4;
  maxOutCount = 3;

  settingsService = inject(SettingsService);
  editsService = inject(EditsTrackerService);
  alertController = inject(AlertController);

  constructor() {
    this.setInGameDefaults();
    this.setLimitSettings();
    this.editsService.pushAction('out', this.currentNumberOfOuts, true);
    this.settingsService.settingsSaved.subscribe(() => this.setLimitSettings());

    addIcons({ arrowRedoSharp, arrowUndoSharp, pauseSharp, playSharp, reloadOutline });
  }

  setLimitSettings() {
    this.maxInnings = this.settingsService.getInnings();
    this.timeRemaining = this.settingsService.getTimeRemaining();

    this.startingBallCount = this.settingsService.getStartingBallCount();
    this.startingStrikeCount = this.settingsService.getStartingStrikeCount();
    this.startingFoulCount = this.settingsService.getStartingFoulCount();
    this.startingOutCount = this.settingsService.getStartingOutCount();

    this.maxBallCount = this.settingsService.getMaxBallCount();
    this.maxStrikeCount = this.settingsService.getMaxStrikeCount();
    this.maxFoulCount = this.settingsService.getHasUnlimitedFouls() ? 999 : this.settingsService.getMaxFoulCount();
    this.resetBallCount(false);
  }

  setInGameDefaults() {
    this.gameInProgress = false;
    this.awayTeamScore = 0;
    this.homeTeamScore = 0;
    this.currentInning = 1;
    this.currentNumberOfOuts = 0;
    this.currentInningPosition = 'top';
    this.timeRemaining = this.settingsService.getTimeRemaining();
    this.canRedo = this.editsService.canUserUndo();
    this.canUndo = this.editsService.canUserRedo();
  }

  resetBallCount(pushAction = true) {
    //save the previous state before resetting
    //we need to have the state right before an out happened
    if (pushAction) {
      this.editsService.pushAction('ball', this.currentBallsCount, true);
      this.editsService.pushAction('strike', this.currentStrikesCount, true);
      this.editsService.pushAction('foul', this.currentFoulsCount, true);
    }

    this.currentBallsCount = this.startingBallCount;
    this.currentStrikesCount = this.startingStrikeCount;
    this.currentFoulsCount = this.startingFoulCount;

    if (pushAction) {
      this.editsService.pushAction('ball', this.currentBallsCount, true);
      this.editsService.pushAction('strike', this.currentStrikesCount, true);
      this.editsService.pushAction('foul', this.currentFoulsCount, true);
    }
  }

  resetGame() {
    this.resetBallCount(false);
    if (this.timeRemainingId) {
      clearInterval(this.timeRemainingId);
      this.timeRemainingId = null;
    }
    this.setInGameDefaults();
    this.editsService.reset();
  }

  toggleTimeRemaining() {
    if (this.timeRemainingId) {
      clearInterval(this.timeRemainingId);
      this.timeRemainingId = null;
    } else {
      this.timeRemainingId = setInterval(async () => {
        this.timeRemaining -= 1000;
        if (this.timeRemaining <= 0) {
          if (this.timeRemainingId) {
            clearInterval(this.timeRemainingId);
          }
          this.gameInProgress = false;
          const alert = await this.alertController.create({
            header: 'Game Clock has expired!',
            buttons: ['OK'],
          });

          await alert.present();
        }
      }, 1000);
      this.gameInProgress = true;
    }
  }

  onScoreClick(data: TickerClickData) {
    if (data.currentTeamFieldingType === 'offense') {
      this.offenseScored();
    }
  }

  onTickerClick(data: TickerClickData) {
    let countType = data.countType;
    let isBulkAction = false;
    switch (countType) {
      case "ball":
        if (this.currentBallsCount === this.startingBallCount) {
          this.editsService.pushAction('ball', this.currentBallsCount, true);
        }
        this.currentBallsCount++;
        isBulkAction = this.currentBallsCount >= this.maxBallCount;
        this.editsService.pushAction('ball', this.currentBallsCount, isBulkAction);

        if (isBulkAction) {
          this.resetBallCount();
          this.editsService.pushAction('ball', this.startingBallCount, false);
        }
        break;
      case "strike":
        if (this.currentStrikesCount === this.startingStrikeCount) {
          this.editsService.pushAction('strike', this.currentStrikesCount, true);
        }
        this.currentStrikesCount++;
        isBulkAction = this.currentStrikesCount >= this.maxStrikeCount;
        this.editsService.pushAction('strike', this.currentStrikesCount, isBulkAction);

        if (isBulkAction) {
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);
          this.currentNumberOfOuts++;
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);

          this.resetBallCount();

          if (this.currentNumberOfOuts >= this.maxOutCount) {
            this.goToNextInning();
          }
          this.editsService.pushAction('strike', this.startingStrikeCount, false);
        }
        break;
      case "foul":
        if (this.currentFoulsCount === this.startingFoulCount) {
          this.editsService.pushAction('foul', this.currentFoulsCount, true);
        }
        this.currentFoulsCount++;
        isBulkAction = this.currentFoulsCount >= this.maxFoulCount;
        this.editsService.pushAction('foul', this.currentFoulsCount, isBulkAction);

        if (isBulkAction) {
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);
          this.currentNumberOfOuts++;
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);

          this.resetBallCount();

          if (this.currentNumberOfOuts >= this.maxOutCount) {
            this.goToNextInning();
          }
          this.editsService.pushAction('foul', this.startingFoulCount, false);
        }
        break;
      case "out":
        if (this.currentNumberOfOuts === this.startingOutCount) {
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);
        }
        this.currentNumberOfOuts++;
        isBulkAction = this.currentNumberOfOuts >= this.maxOutCount;
        this.editsService.pushAction('out', this.currentNumberOfOuts, isBulkAction);
        this.resetBallCount();

        if (isBulkAction) {
          this.editsService.pushAction('out', this.currentNumberOfOuts, true);
          this.goToNextInning();
          this.editsService.pushAction('out', this.startingOutCount, false);
        }
    }
  }

  goToNextInning() {
    this.editsService.pushAction('inningPosition', this.currentInningPosition, true);
    this.currentInningPosition = this.currentInningPosition === 'bottom' ? 'top' : 'bottom';
    this.editsService.pushAction('inningPosition', this.currentInningPosition, true);
    if (this.currentInningPosition === 'top' ) {
      this.editsService.pushAction('inning', this.currentInning, true);
      this.currentInning++;
      this.editsService.pushAction('inning', this.currentInning, true);
    }
    this.currentNumberOfOuts = 0;
  }

  onRunnerScored() {
    this.resetBallCount();
    this.offenseScored();
  }

  onKickerSafe() {
    this.resetBallCount();
  }

  offenseScored() {
    if (this.currentInningPosition === 'top') {
      this.editsService.pushAction('awayTeamScore', this.awayTeamScore, true);
      this.awayTeamScore++;
      this.editsService.pushAction('awayTeamScore', this.awayTeamScore, false);
    } else {
      this.editsService.pushAction('homeTeamScore', this.homeTeamScore, true);
      this.homeTeamScore++;
      this.editsService.pushAction('homeTeamScore', this.homeTeamScore, false);
    }
  }

  handleEdits(editType: EditType) {
    const userAction = this.editsService.traverseActions(editType);

    if (!userAction) {
      return;
    }

    switch (userAction.action) {
      case 'score':
      case 'awayTeamScore':
      case 'homeTeamScore':
        const score = Number(userAction.value);
        if (this.currentInningPosition === 'top') {
          this.awayTeamScore = score;
        } else {
          this.homeTeamScore = score;
        }

        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'ball':
        const ballCount = Number(userAction.value);
        this.currentBallsCount = ballCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'strike':
        const strikeCount = Number(userAction.value);
        this.currentStrikesCount = strikeCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'foul':
        const foulsCount = Number(userAction.value);
        this.currentFoulsCount = foulsCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'out':
        this.currentNumberOfOuts = Number(userAction.value);
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'resetBallCount':
        this.resetBallCount(false);
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'inningPosition':
        const inningPosition = userAction.value as InningPosition;
        this.currentInningPosition = inningPosition;

        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case 'inning':
        this.currentInning = Number(userAction.value);
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      default:
        break;
    }
  }

  async confirmGameReset() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to reset the game?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: ()=> {
            this.resetGame();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ],
    });

    await alert.present();
  }
}
