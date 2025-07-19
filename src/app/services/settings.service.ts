import { Injectable } from '@angular/core';
import { RulesSettings } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  timeRemaining: number = 2700000;
  innings = 5;
  startingBallCount = 1;
  startingStrikeCount = 0;
  startingFoulCount = 1;
  storageKey = 'rules_settings';

  constructor() {
    const mergedSettings = this.getSettings();

    this.timeRemaining = mergedSettings.timeRemaining;
    this.innings = mergedSettings.innings;
    this.startingBallCount = mergedSettings.startingBallCount;
    this.startingStrikeCount = mergedSettings.startingStrikeCount;
    this.startingFoulCount = mergedSettings.startingFoulCount;
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  getInnings() {
    return this.innings;
  }

  getStartingBallCount() {
    return this.startingBallCount;
  }

  getStartingStrikeCount() {
    return this.startingStrikeCount;
  }

  getStartingFoulCount() {
    return this.startingFoulCount;
  }

  getSettings(): RulesSettings {
    const storedSettings = JSON.parse(<string>localStorage.getItem(this.storageKey));
    const mergedSettings = Object.assign({}, this, storedSettings);
    delete mergedSettings.storageKey;

    return mergedSettings;
  }

  saveSettings(settings: RulesSettings) {
    const { timeRemaining, innings, startingBallCount, startingStrikeCount, startingFoulCount } = this;
    const mergedSettings =
      Object.assign(settings, { timeRemaining, innings, startingBallCount, startingStrikeCount, startingFoulCount });

    localStorage.setItem(this.storageKey, JSON.stringify(mergedSettings));
  }
}
