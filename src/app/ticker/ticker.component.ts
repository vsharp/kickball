import { Component, Input, input, InputSignal, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CountType, InningPosition, TeamFieldingType, TeamVisitationType } from '../types';

@Component({
  selector: 'app-ticker',
  imports: [MatIconModule],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.scss'
})
export class TickerComponent implements OnChanges {
  @Input() score = 0;
  // score = input(0);
  currentTeamFieldingType: TeamFieldingType = 'defense';
  // @Input() currentTeamFieldingType: 'offense' | 'defense' = 'defense';
  @Input() inningPosition: InningPosition = 'top';
  // public currentTeamFieldingType: InputSignal<string> = input('offense');
  // 'offense' | 'defense'
  @Input() teamVisitation: TeamVisitationType = 'home';

  @Input() countType!: CountType;

  @Output() tickerClicked = new EventEmitter();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCurrentFielding();
  }

  getCurrentFielding() {
    if (
      (this.inningPosition === 'top' && this.teamVisitation === 'away') ||
      (this.inningPosition === 'bottom' && this.teamVisitation === 'home')
    ) {
      this.currentTeamFieldingType = 'offense';
    } else {
      this.currentTeamFieldingType = 'defense';
    }
  }

  getCountTypeLabel() {
    switch (this.countType) {
      case 'strike':
        return 'Strikes';
      case 'ball':
        return 'Balls';
      case 'foul':
        return 'Fouls';
      case 'out':
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
