import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import {
  CountType,
  CountTypes,
  InningPosition,
  InningPositions,
  TeamFieldingType,
  TeamFieldingTypes,
  TeamVisitationType,
  TeamVisitationTypes
} from '../types';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { caretDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ticker',
  imports: [IonButton, IonIcon],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.scss'
})
export class TickerComponent implements OnChanges {
  @Input() score = 0;
  @Input() inningPosition: InningPosition = InningPositions.top;
  @Input() teamVisitation: TeamVisitationType = TeamVisitationTypes.home;
  @Input() countType!: CountType;
  @Input() marqueeText: string = '';
  @Input() marqueeDurationSec: number = 8; // animation duration in seconds
  @Input() bgColor: string | undefined;

  @Output() tickerClicked = new EventEmitter();

  protected readonly TeamVisitationTypes = TeamVisitationTypes;
  protected readonly TeamFieldingTypes = TeamFieldingTypes;
  protected readonly CountTypes = CountTypes;

  currentTeamFieldingType: TeamFieldingType = TeamFieldingTypes.defense;

  constructor() {
    addIcons({ caretDownOutline });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCurrentFielding();
  }

  getCurrentFielding() {
    if (
      (this.inningPosition === InningPositions.top && this.teamVisitation === TeamVisitationTypes.away) ||
      (this.inningPosition === InningPositions.bottom && this.teamVisitation === TeamVisitationTypes.home)
    ) {
      this.currentTeamFieldingType = TeamFieldingTypes.offense;
    } else {
      this.currentTeamFieldingType = TeamFieldingTypes.defense;
    }
  }

  getCountTypeLabel() {
    switch (this.countType) {
      case CountTypes.strike:
        return 'Strikes';
      case CountTypes.ball:
        return 'Balls';
      case CountTypes.foul:
        return 'Fouls';
      case CountTypes.out:
        return 'Outs';
      default:
        return '';
    }
  }

  onTickerClick(evt: Event) {
    let data: TickerClickData = { countType: this.countType, currentTeamFieldingType: this.currentTeamFieldingType };
    this.tickerClicked.emit(data);
  }
}

export type TickerClickData = { countType: CountType; currentTeamFieldingType: TeamFieldingType };
