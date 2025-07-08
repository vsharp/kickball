import { Component, Input } from '@angular/core';
import { InningPosition } from '../types';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inning-ticker',
  imports: [
    MatIcon,
  ],
  templateUrl: './inning-ticker.component.html',
  styleUrl: './inning-ticker.component.scss'
})
export class InningTickerComponent {

  @Input() inningPosition: InningPosition = 'top';

  @Input() currentInning  = 1;


}
