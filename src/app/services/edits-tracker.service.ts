import { Injectable } from '@angular/core';
import { EditType, EditTypes, InGameUserAction, InGameUserActionType } from '../types';

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
    if (this.currentIndex < this.actions.length - 1) {
      //User is trying to go back in time and change things like they never happened before
      //Slice the array where the crime happened and let's go on about our business
      this.actions = this.actions.slice(0, this.currentIndex + 1);
      //we're now using a fresh sliced actions array and pushed an action on top, so we can no longer redo
      this.canRedo = false;
    }

    this.actions.push({ action, value, isBulkAction });
    if (this.currentIndex >= 0) {
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
    let action: InGameUserAction | null = null;
    if (editType === EditTypes.undo) {
      if (this.currentIndex > -1) {
        action = this.actions[--this.currentIndex];
        //if you undo, of course you can redo after
        this.canRedo = true;
      } else {
        this.canUndo = false;
      }
    } else {
      if (this.currentIndex < this.actions.length - 1) {
        action = this.actions[++this.currentIndex];
        //if you redo, then of course you can undo it
        this.canUndo = true;
      }
    }
    if (this.currentIndex < 1) {
      this.canUndo = false;
    } else if (this.currentIndex >= this.actions.length - 1) {
      this.canRedo = false;
    }

    return action;
  }

  isNextActionBulkAction(editType: EditType): boolean {
    if (editType === EditTypes.undo) {
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

  reset() {
    this.actions = [];
    this.currentIndex = -1;
    this.canUndo = false;
    this.canRedo = false;
  }
}
