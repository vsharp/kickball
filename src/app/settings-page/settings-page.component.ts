import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { RulesSettings } from '../types';
import {
  AlertController,
  IonAccordion,
  IonAccordionGroup, IonCheckbox,
  IonInput,
  IonItem,
  IonLabel, IonList
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-page',
  imports: [
    ReactiveFormsModule,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonCheckbox,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  settingsFormBuilder = new FormBuilder();
  settingsForm!: FormGroup;
  currentSettings!: RulesSettings;
  settingsSavedClick!: Subscription;


  settingsService = inject(SettingsService);
  alertController = inject(AlertController);

  constructor() {
    this.currentSettings = this.settingsService.getSettings();
    this.settingsSavedClick = this.settingsService.settingsSaved.subscribe(() => this.onSave());

    const gameDuration = this.settingsService.convertTime(this.currentSettings.timeRemaining);

    this.settingsForm = this.settingsFormBuilder.group({
      startingStrikeCount: this.currentSettings.startingStrikeCount,
      startingBallCount: this.currentSettings.startingBallCount,
      startingFoulCount: this.currentSettings.startingFoulCount,
      startingOutCount: this.currentSettings.startingOutCount,
      maxStrikeCount: this.currentSettings.maxStrikeCount,
      maxBallCount: this.currentSettings.maxBallCount,
      maxFoulCount: this.currentSettings.maxFoulCount,
      maxOutCount: this.currentSettings.maxOutCount,
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
      maxStrikeCount: submittedSettings.maxStrikeCount,
      maxBallCount: submittedSettings.maxBallCount,
      maxFoulCount: submittedSettings.maxFoulCount,
      maxOutCount: submittedSettings.maxOutCount,
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
