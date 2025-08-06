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
  startingOutCount = 0;

  maxBallCount = 4;
  maxStrikeCount = 3;
  maxFoulCount = 4;
  maxOutCount = 3;

  private storageKey = 'rules_settings';

  constructor() {
    const mergedSettings = this.getSettings();

    this.timeRemaining = mergedSettings.timeRemaining;
    this.innings = mergedSettings.innings;

    this.startingBallCount = mergedSettings.startingBallCount;
    this.startingStrikeCount = mergedSettings.startingStrikeCount;
    this.startingFoulCount = mergedSettings.startingFoulCount;
    this.startingOutCount = mergedSettings.startingOutCount;

    this.maxBallCount = mergedSettings.maxBallCount;
    this.maxStrikeCount = mergedSettings.maxStrikeCount;
    this.maxFoulCount = mergedSettings.maxFoulCount;
    this.maxOutCount = mergedSettings.maxOutCount;
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

  getStartingOutCount() {
      return this.startingOutCount;
  }

  getSettings(): RulesSettings {
    const storedSettings = JSON.parse(<string>localStorage.getItem(this.storageKey));
    const mergedSettings = Object.assign({}, this, storedSettings);
    delete mergedSettings.storageKey;

    return mergedSettings;
  }

  convertTime(mTime: number) {
    let minutes = mTime / 60000;
    let seconds = mTime % 60000 / 1000;
    const convertedTime = { minutes, seconds };

    return convertedTime;
  }

  saveSettings(settings: RulesSettings) {
    const {
      timeRemaining,
      innings,
      startingBallCount,
      startingStrikeCount,
      startingFoulCount,
      startingOutCount,
      maxBallCount,
      maxStrikeCount,
      maxFoulCount,
      maxOutCount
    } = this;

    const mergedSettings =
      Object.assign({
        timeRemaining,
        innings,
        startingBallCount,
        startingStrikeCount,
        startingFoulCount,
        startingOutCount,
        maxBallCount,
        maxStrikeCount,
        maxFoulCount,
        maxOutCount
      }, settings);

    localStorage.setItem(this.storageKey, JSON.stringify(mergedSettings));
  }
}
