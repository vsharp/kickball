import { Injectable } from '@angular/core';
import { CountType, EditType, InGameUserAction, InGameUserActionType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class EditsTrackerService {
  actions: InGameUserAction[] = [];
  currentIndex = -1;

  constructor() { }

  pushAction(action: InGameUserActionType, value: number) {
    console.log('this.currentIndex', this.currentIndex, this.actions.length);
    if (this.currentIndex < this.actions.length - 1) {
      //User trying to go back in time and change things like they never happened before
      //Slice the array where the crime happened and let's go on about our business
      this.actions = this.actions.slice(0, this.currentIndex + 1);
    }
    this.actions.push({ action, value });
    this.currentIndex++;
  }

  popAction(): InGameUserAction | null {
    if (this.currentIndex > -1) {
      const action = this.actions[this.currentIndex--];

      return action;
    } else {
      return null;
    }
  }

  traverseActions(editType: EditType) {
    console.log('this.currentIndex', this.currentIndex, this.actions);
    let action: InGameUserAction | null = null;
    if (editType === 'undo') {
      if (this.currentIndex > -1) {
        action = this.actions[this.currentIndex--];
        console.log('undo', action);
      }
    } else {
      if (this.currentIndex < this.actions.length - 1) {
        action = this.actions[++this.currentIndex];
        console.log('redo', action);
      }
    }

    return action;
  }
}
