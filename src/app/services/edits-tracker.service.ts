import { Injectable } from '@angular/core';
import { CountType, EditType, InGameUserAction, InGameUserActionType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class EditsTrackerService {
  actions: InGameUserAction[] = [];
  currentIndex = -1;

  constructor() { }

  // pushAction(action: InGameUserActionType, value: number) {
  pushAction(action: string, value: number) {
    console.log('this.currentIndex', this.currentIndex);
    console.log('this.actions', this.actions);
    if (this.currentIndex < this.actions.length - 1) {
      console.log('<', this.currentIndex, this.actions.slice(0, this.currentIndex));
      this.actions = this.actions.slice(0, this.currentIndex + 1
      );
      console.log('< this.actions', this.actions);

    }
    this.actions.push(<InGameUserAction>{ action, value });
    this.currentIndex++;
    console.log('this. +', this.currentIndex, this.actions);
  }

  popAction(): InGameUserAction | null {
    if (this.currentIndex > -1) {
      const action = this.actions[this.currentIndex--];

      return action;
    } else {
      return null;
    }
    // return this.actions.length > 0 ? this.actions.pop() : null;
  }

  traverseActions(editType: EditType) {
    console.log('this.currentIndex', this.currentIndex);
    console.log('this.actions', this.actions);
    let action: InGameUserAction | null = null;
    if (editType === 'undo') {
      if (this.currentIndex > 0) {
        action = this.actions[this.currentIndex--];
      }
    } else {
      if (this.currentIndex < this.actions.length - 1) {
        action = this.actions[this.currentIndex++];
      }
    }

    return action;
  }
}
