import { Component, inject } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { SettingsService } from '../services/settings.service';
import { RulesSettings } from '../types';
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
  selector: 'app-settings-page',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatAnchor,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  settingsFormBuilder = new FormBuilder();
  settingsForm!: FormGroup;
  currentSettings!: RulesSettings;

  settingsService = inject(SettingsService);

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

  onSave() {
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

    alert('Settings Saved');
  }
}
