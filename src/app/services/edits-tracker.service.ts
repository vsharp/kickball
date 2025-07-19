import { Injectable } from '@angular/core';
import { CountType, EditType, InGameUserAction, InGameUserActionType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class EditsTrackerService {
  private actions: InGameUserAction[] = [];
  private currentIndex = -1;
  private canUndo = false;
  private canRedo = false;

  constructor() { }

  pushAction(action: InGameUserActionType, value: number | string, isBulkAction = false) {
    console.log('this.currentIndex', this.currentIndex);
    if (this.currentIndex < this.actions.length - 1) {
      //User is trying to go back in time and change things like they never happened before
      //Slice the array where the crime happened and let's go on about our business
      this.actions = this.actions.slice(0, this.currentIndex + 1);
      //we're now using a fresh sliced actions array and pushed an action on top, so we can no longer redo
      this.canRedo = false;
    }
    // console.log('new currentIndex', this.currentIndex);

    this.actions.push({ action, value, isBulkAction });
    if (this.currentIndex > 0) {
      this.canUndo = true;
    }

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
    console.log('this.currentIndex', this.currentIndex, editType);
    console.log('actions', this.actions);
    let action: InGameUserAction | null = null;
    if (editType === 'undo') {
      if (this.currentIndex > -1) {
        // if (this.currentIndex >= this.actions.length - 1) {
        //   action = this.actions[this.currentIndex];
        //   this.currentIndex--;
        // } else {
          action = this.actions[--this.currentIndex];
        // }
        //if you undo, of course you can redo after
        this.canRedo = true;
      } else {
        this.canUndo = false;
      }
    } else {
      if (this.currentIndex < this.actions.length - 1) {
        action = this.actions[++this.currentIndex];
        console.log('this.currentIndex', this.currentIndex, editType);

        //if you redo, then of course you can undo it
        this.canUndo = true;
      }
    }
    console.log('action', action);
    if (this.currentIndex < 1) {
      this.canUndo = false;
    } else if (this.currentIndex >= this.actions.length - 1) {
      this.canRedo = false;
    }

    return action;
  }

  isNextActionBulkAction(editType: EditType): boolean {
    if (editType === 'undo') {
      console.log('nextActionBulkAction', this.actions[this.currentIndex - 1]);
      return this.actions[this.currentIndex - 1]?.isBulkAction || false;
    }
    return this.actions[this.currentIndex + 1]?.isBulkAction || false;
  }

  canUserUndo() {
    return this.canUndo;
  }

  canUserRedo() {
    return this.canRedo;
  }

  getActions() {
    return this.actions;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}
