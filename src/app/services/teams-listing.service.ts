import { Injectable } from '@angular/core';
import { TeamInfo } from '../types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsListingService {

  teams: TeamInfo[];

  private storageKey = 'teams_listing';

  teamsListingSaved: Subject<void> = new Subject<void>();

  constructor() {
    this.teams = this.getTeams() || [];
  }

  getTeams(): TeamInfo[] {
    const storedTeams = JSON.parse(<string>localStorage.getItem(this.storageKey));

    return storedTeams;
  }

  saveTeams() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.teams));
    this.teamsListingSaved.next();
  }

  setTeam(team: TeamInfo) {
    if (!team?.id && team?.id != 0) {
      team.id = this.teams.length;
    }
    this.teams[team.id] = team;

    this.saveTeams();
  }

  removeTeam(team: TeamInfo) {
    this.teams.splice(team.id, 1);
    this.saveTeams();
  }
}
