import { Routes } from '@angular/router';
import { GameTrackerComponent } from './game-tracker/game-tracker.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game-tracker', pathMatch: 'full' },
  { path: 'game-tracker', component: GameTrackerComponent },
  { path: 'settings', component: SettingsPageComponent },
];
