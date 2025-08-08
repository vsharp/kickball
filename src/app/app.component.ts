import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonRouterOutlet,
  IonToolbar
} from '@ionic/angular/standalone';
import { SettingsService } from './services/settings.service';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [IonButton, IonButtons, IonHeader, IonToolbar, IonContent, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ump Your Way!!';
  toolBarActive = false;

  settingsService = inject(SettingsService);
  route = inject(Router);

  constructor() {
    this.route.events.subscribe((data) => {
      if (data instanceof NavigationStart) {
        this.toolBarActive = data.url === '/settings';
      }
    });
  }

  onToolbarSave() {
    this.settingsService.saveButtonClicked();
  }
}
