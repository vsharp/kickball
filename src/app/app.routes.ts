import { Routes } from '@angular/router';
import { GameTrackerComponent } from './game-tracker/game-tracker.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { AppNavComponent } from './app-nav/app-nav.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game/game-tracker', pathMatch: 'full' },
  {
    path: 'game',
    component: AppNavComponent,
    children: [
      { path: 'game-tracker', component: GameTrackerComponent },
      { path: 'settings', component: SettingsPageComponent },

    ],
  },
];
