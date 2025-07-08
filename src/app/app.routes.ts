import { Routes } from '@angular/router';
import { GameTrackerComponent } from './game-tracker/game-tracker.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game-tracker', pathMatch: 'full' },
  { path: 'game-tracker', component: GameTrackerComponent },
];
