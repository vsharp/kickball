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
  IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel,
  IonList,
  IonModal, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trash } from 'ionicons/icons';
import { TeamInfo } from '../types';
import { TeamsListingService } from '../services/teams-listing.service';
import { ColorPickerDirective } from 'ngx-color-picker';

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
    IonItemOption,
    ColorPickerDirective,
    IonLabel
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
  teamColor = '#FFFFFF';

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

  onColorSelected(selectedColor: string) {
    this.teamColor = selectedColor;
    this.teamsListingForm.patchValue({ color: this.teamColor });
  }

  async onEditTeamClick(type: 'add' | 'update' | 'remove', team?: TeamInfo | null) {
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
      this.teamColor = team?.color || '#FFFFFF';
      this.isModalOpen = true;
    }
  }

  async onTeamSaveClick() {
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
