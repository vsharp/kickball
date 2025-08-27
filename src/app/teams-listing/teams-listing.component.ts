import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons, IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonItemOption, IonItemOptions, IonItemSliding,
  IonList,
  IonModal, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trash } from 'ionicons/icons';
import { TeamInfo } from '../types';
import { TeamsListingService } from '../services/teams-listing.service';

@Component({
  selector: 'app-teams-listing',
  templateUrl: './teams-listing.component.html',
  styleUrls: ['./teams-listing.component.scss'],
  imports: [
    FormsModule,
    IonInput,
    IonItem,
    IonList,
    ReactiveFormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ]
})
export class TeamsListingComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(IonList) ionList!: IonList;

  isModalOpen = false;
  teamsListingFormBuilder = new FormBuilder();
  teamsListingForm!: FormGroup;

  teams: TeamInfo[] = [];
  selectedTeam: TeamInfo | null = null;

  teamsListingService = inject(TeamsListingService);
  alertController = inject(AlertController);

  constructor() {
    addIcons({ addOutline, trash });

    this.teams = this.teamsListingService.getTeams();
  }

  cancel() {
    this.isModalOpen = false;
    this.selectedTeam = null;
  }

  async editTeam(type: 'add' | 'update' | 'remove', team?: TeamInfo | null) {
    if (type === 'remove' && team) {
      const alert = await this.alertController.create({
        header: 'Remove Team?',
        message: `Are you sure you want to remove ${team.name}`,
        buttons: [
          {
            text: 'Yes',
            role: 'confirm',
            handler: ()=> {
              this.removeTeam(team);
              this.isModalOpen = false;
              this.selectedTeam = null;
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
          }
        ],
      });

      await alert.present();
      await this.ionList.closeSlidingItems();
    } else {
      if (team) {
        this.selectedTeam = team;
      }

      this.teamsListingForm = this.teamsListingFormBuilder.group({
        id: team?.id,
        name: team?.name,
        color: team?.color,
      });
      this.isModalOpen = true;
    }
  }

  async onTeamEdit() {
    const updatedTeamInfo = this.teamsListingForm.value;
    this.isModalOpen = false;

    this.teamsListingService.setTeam(updatedTeamInfo);

    const alert = await this.alertController.create({
      header: 'Team Saved',
      buttons: ['OK'],
    });

    await alert.present();

    this.teams = this.teamsListingService.getTeams();
    this.selectedTeam = null;
  }

  removeTeam(team: TeamInfo) {
    this.teamsListingService.removeTeam(team);
    this.teams = this.teamsListingService.getTeams();
  }
}
