import { Component, Input, input, InputSignal, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InningPosition, TeamFieldingType, TeamVisitationType } from '../types';

@Component({
  selector: 'app-score-ticker',
  imports: [MatIconModule],
  templateUrl: './score-ticker.component.html',
  styleUrl: './score-ticker.component.scss'
})
export class ScoreTickerComponent implements OnChanges {
  @Input() score = 0;
  // score = input(0);
  currentTeamFieldingType: TeamFieldingType = 'defense';
  // @Input() currentTeamFieldingType: 'offense' | 'defense' = 'defense';
  @Input() inningPosition: InningPosition = 'top';
  // public currentTeamFieldingType: InputSignal<string> = input('offense');
  // 'offense' | 'defense'
  @Input() teamVisitation: TeamVisitationType = 'home';

  @Input() countType!: 'strikes' | 'balls' | 'fouls' | 'outs' | 'scores';

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
    }
  }

  getCountTypeLabel() {
    switch (this.countType) {
      case 'strikes':
        return 'Strikes';
      case 'balls':
        return 'Balls';
      case 'fouls':
        return 'Fouls';
      case 'outs':
        return 'Outs';
      default:
        return '';
    }
  }

}
