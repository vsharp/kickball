import { Routes } from '@angular/router';
import { GameTrackerComponent } from './game-tracker/game-tracker.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { TeamsListingComponent } from './teams-listing/teams-listing.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game-tracker', pathMatch: 'full' },
  {
    path: '',
    component: AppNavComponent,
    children: [
      { path: 'game-tracker', component: GameTrackerComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'teams-listing', component: TeamsListingComponent },
    ],
  },
];
