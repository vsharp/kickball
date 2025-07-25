import { Component, Input } from '@angular/core';
import { InningPosition } from '../types';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inning-ticker',
  imports: [
    IonIcon,
  ],
  templateUrl: './inning-ticker.component.html',
  styleUrl: './inning-ticker.component.scss'
})
export class InningTickerComponent {

  @Input() inningPosition: InningPosition = 'top';

  @Input() currentInning  = 1;

  constructor() {
    addIcons({ caretUpOutline, caretDownOutline });
  }

}
