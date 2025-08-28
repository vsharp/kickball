import { Component, inject } from '@angular/core';
import { TickerComponent, TickerClickData } from '../ticker/ticker.component';
import { InningTickerComponent } from '../inning-ticker/inning-ticker.component';
import { TimeRemainingPipe } from '../pipes/time-remaining.pipe';
import { SettingsService } from '../services/settings.service';
import { EditsTrackerService } from '../services/edits-tracker.service';
import {
  CountTypes,
  EditType,
  EditTypes,
  InningPosition,
  InningPositions,
  TeamFieldingTypes, TeamInfo, TeamVisitationType,
  TeamVisitationTypes
} from '../types';
import {
  AlertController,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPopover,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowRedoSharp, arrowUndoSharp, pauseSharp, playSharp, reloadOutline } from 'ionicons/icons';
import { TeamsListingService } from '../services/teams-listing.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-game-tracker',
  imports: [TickerComponent, InningTickerComponent, TimeRemainingPipe, IonButton, IonIcon, IonFab, IonFabButton, IonPopover, IonSelect, IonSelectOption, NgTemplateOutlet],
  templateUrl: './game-tracker.component.html',
  styleUrl: './game-tracker.component.scss'
})
export class GameTrackerComponent {
  public awayTeamScore!: number;
  public homeTeamScore!: number;
  public currentInningPosition: InningPosition = InningPositions.top;
  public currentInning!: number;
  public currentBallsCount!: number;
  public currentStrikesCount!: number;
  public currentFoulsCount!: number;
  public currentNumberOfOuts!: number;
  public canUndo = false;
  public canRedo = false;
  public gameInProgress = false;
  public isHomeTeamPopoverOpen = false;
  public isAwayTeamPopoverOpen = false;
  public teams: TeamInfo[] = [];
  public awayTeamName = '';
  public homeTeamName = '';
  public awayTeamColor: string | undefined;
  public homeTeamColor: string | undefined;

  public weDebuggingOrNah = false;

  timeRemainingId!: NodeJS.Timeout | null;

  //configurable settings
  public timeRemaining = 2700000; //2700000 = 45min
  //starts
  private startingBallCount = 0;
  private startingStrikeCount = 0;
  private startingFoulCount = 0;
  private startingOutCount = 0;
  //maxes
  private maxInnings = 5;
  private maxBallCount = 4;
  private maxStrikeCount = 3;
  private maxFoulCount = 4;
  private maxOutCount = 3;

  private settingsService = inject(SettingsService);
  editsService = inject(EditsTrackerService);
  private alertController = inject(AlertController);
  private teamsListingService = inject(TeamsListingService);

  protected readonly TeamVisitationTypes = TeamVisitationTypes;
  protected readonly CountTypes = CountTypes;
  protected readonly EditTypes = EditTypes;

  constructor() {
    this.setInGameDefaults();
    this.setLimitSettings();
    this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);
    this.settingsService.settingsSaved.subscribe(() => this.setLimitSettings());
    this.teams = this.teamsListingService.getTeams();

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
    this.currentInningPosition = InningPositions.top;
    this.timeRemaining = this.settingsService.getTimeRemaining();
    this.canRedo = this.editsService.canUserUndo();
    this.canUndo = this.editsService.canUserRedo();
  }

  resetBallCount(pushAction = true) {
    //save the previous state before resetting
    //we need to have the state right before an out happened
    if (pushAction) {
      this.editsService.pushAction(CountTypes.ball, this.currentBallsCount, true);
      this.editsService.pushAction(CountTypes.strike, this.currentStrikesCount, true);
      this.editsService.pushAction(CountTypes.foul, this.currentFoulsCount, true);
    }

    this.currentBallsCount = this.startingBallCount;
    this.currentStrikesCount = this.startingStrikeCount;
    this.currentFoulsCount = this.startingFoulCount;

    if (pushAction) {
      this.editsService.pushAction(CountTypes.ball, this.currentBallsCount, true);
      this.editsService.pushAction(CountTypes.strike, this.currentStrikesCount, true);
      this.editsService.pushAction(CountTypes.foul, this.currentFoulsCount, true);
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
    if (data.currentTeamFieldingType === TeamFieldingTypes.offense) {
      this.offenseScored();
    }
  }

  onTickerClick(data: TickerClickData) {
    let countType = data.countType;
    let isBulkAction = false;
    switch (countType) {
      case CountTypes.ball:
        if (this.currentBallsCount === this.startingBallCount) {
          this.editsService.pushAction(CountTypes.ball, this.currentBallsCount, true);
        }
        this.currentBallsCount++;
        isBulkAction = this.currentBallsCount >= this.maxBallCount;
        this.editsService.pushAction(CountTypes.ball, this.currentBallsCount, isBulkAction);

        if (isBulkAction) {
          this.resetBallCount();
          this.editsService.pushAction(CountTypes.ball, this.startingBallCount, false);
        }
        break;
      case CountTypes.strike:
        if (this.currentStrikesCount === this.startingStrikeCount) {
          this.editsService.pushAction(CountTypes.strike, this.currentStrikesCount, true);
        }
        this.currentStrikesCount++;
        isBulkAction = this.currentStrikesCount >= this.maxStrikeCount;
        this.editsService.pushAction(CountTypes.strike, this.currentStrikesCount, isBulkAction);

        if (isBulkAction) {
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);
          this.currentNumberOfOuts++;
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);

          this.resetBallCount();

          if (this.currentNumberOfOuts >= this.maxOutCount) {
            this.goToNextInning();
          }
          this.editsService.pushAction(CountTypes.strike, this.startingStrikeCount, false);
        }
        break;
      case CountTypes.foul:
        if (this.currentFoulsCount === this.startingFoulCount) {
          this.editsService.pushAction(CountTypes.foul, this.currentFoulsCount, true);
        }
        this.currentFoulsCount++;
        isBulkAction = this.currentFoulsCount >= this.maxFoulCount;
        this.editsService.pushAction(CountTypes.foul, this.currentFoulsCount, isBulkAction);

        if (isBulkAction) {
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);
          this.currentNumberOfOuts++;
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);

          this.resetBallCount();

          if (this.currentNumberOfOuts >= this.maxOutCount) {
            this.goToNextInning();
          }
          this.editsService.pushAction(CountTypes.foul, this.startingFoulCount, false);
        }
        break;
      case CountTypes.out:
        if (this.currentNumberOfOuts === this.startingOutCount) {
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);
        }
        this.currentNumberOfOuts++;
        isBulkAction = this.currentNumberOfOuts >= this.maxOutCount;
        this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, isBulkAction);
        this.resetBallCount();

        if (isBulkAction) {
          this.editsService.pushAction(CountTypes.out, this.currentNumberOfOuts, true);
          this.goToNextInning();
          this.editsService.pushAction(CountTypes.out, this.startingOutCount, false);
        }
    }
  }

  goToNextInning() {
    this.editsService.pushAction(CountTypes.inningPosition, this.currentInningPosition, true);
    this.currentInningPosition = this.currentInningPosition === InningPositions.bottom ? InningPositions.top : InningPositions.bottom;
    this.editsService.pushAction(CountTypes.inningPosition, this.currentInningPosition, true);
    if (this.currentInningPosition === InningPositions.top ) {
      this.editsService.pushAction(CountTypes.inning, this.currentInning, true);
      this.currentInning++;
      this.editsService.pushAction(CountTypes.inning, this.currentInning, true);
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
    if (this.currentInningPosition === InningPositions.top) {
      this.editsService.pushAction(CountTypes.awayTeamScore, this.awayTeamScore, true);
      this.awayTeamScore++;
      this.editsService.pushAction(CountTypes.awayTeamScore, this.awayTeamScore, false);
    } else {
      this.editsService.pushAction(CountTypes.homeTeamScore, this.homeTeamScore, true);
      this.homeTeamScore++;
      this.editsService.pushAction(CountTypes.homeTeamScore, this.homeTeamScore, false);
    }
  }

  handleEdits(editType: EditType) {
    const userAction = this.editsService.traverseActions(editType);

    if (!userAction) {
      return;
    }

    switch (userAction.action) {
      case CountTypes.awayTeamScore:
      case CountTypes.homeTeamScore:
        const score = Number(userAction.value);
        if (this.currentInningPosition === InningPositions.top) {
          this.awayTeamScore = score;
        } else {
          this.homeTeamScore = score;
        }

        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case CountTypes.ball:
        const ballCount = Number(userAction.value);
        this.currentBallsCount = ballCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case CountTypes.strike:
        const strikeCount = Number(userAction.value);
        this.currentStrikesCount = strikeCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case CountTypes.foul:
        const foulsCount = Number(userAction.value);
        this.currentFoulsCount = foulsCount;
        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case CountTypes.out:
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
      case CountTypes.inningPosition:
        const inningPosition = userAction.value as InningPosition;
        this.currentInningPosition = inningPosition;

        if (userAction.isBulkAction) {
          this.handleEdits(editType);
        }
        break;
      case CountTypes.inning:
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

  onTeamSelectChange(evt: CustomEvent, visitationType: TeamVisitationType) {
    const teamName = evt.detail.value;
    const selectedTeam = this.teams.find((team) => team.name === teamName);

    if (visitationType === 'away') {
      this.isAwayTeamPopoverOpen = false;
      this.awayTeamName = teamName;
      this.awayTeamColor = selectedTeam?.color;
    } else {
      this.isHomeTeamPopoverOpen = false;
      this.homeTeamName = teamName;
      this.homeTeamColor = selectedTeam?.color;
    }
  }

}
