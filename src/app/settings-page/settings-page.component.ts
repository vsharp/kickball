import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { RulesSettings } from '../types';
import {
  AlertController,
  IonAccordion,
  IonAccordionGroup,
  IonButton, IonInput,
  IonItem,
  IonLabel, IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-page',
  imports: [
    ReactiveFormsModule,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonList,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  settingsFormBuilder = new FormBuilder();
  settingsForm!: FormGroup;
  currentSettings!: RulesSettings;

  settingsService = inject(SettingsService);
  alertController = inject(AlertController);

  constructor() {
    this.currentSettings = this.settingsService.getSettings();
    const gameDuration = this.settingsService.convertTime(this.currentSettings.timeRemaining)

    this.settingsForm = this.settingsFormBuilder.group({
      startingStrikeCount: this.currentSettings.startingStrikeCount,
      startingBallCount: this.currentSettings.startingBallCount,
      startingFoulCount: this.currentSettings.startingFoulCount,
      startingOutCount: this.currentSettings.startingOutCount,
      numberOfInnings: this.currentSettings.innings,
      gameDuration: gameDuration.minutes,
    });

  }

  async onSave() {
    const submittedSettings = this.settingsForm.value;
    const settingsToSave: RulesSettings =  {
      startingStrikeCount: submittedSettings.startingStrikeCount,
      startingBallCount: submittedSettings.startingBallCount,
      startingFoulCount: submittedSettings.startingFoulCount,
      startingOutCount: submittedSettings.startingOutCount,
      innings: submittedSettings.numberOfInnings,
      timeRemaining: submittedSettings.gameDuration * 60000,
    }

    this.settingsService.saveSettings(settingsToSave);

    const alert = await this.alertController.create({
      header: 'Settings Saved',
      buttons: ['OK'],
    });

    await alert.present();

  }
}
