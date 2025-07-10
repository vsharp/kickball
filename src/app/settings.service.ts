import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  timeRemaining: number = 2700000;
  innings = 5;
  startingBallCount = 1
  startingStrikeCount = 1
  storageKey = 'rules_settings';
  storageMap = new Map();



  constructor() { }

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

  getSettings() {
    return JSON.stringify(localStorage.getItem(this.storageKey));
  }

  saveSettings(setting: string, val: string) {
    localStorage.setItem(this.storageKey, JSON.stringify(val));
  }
}
