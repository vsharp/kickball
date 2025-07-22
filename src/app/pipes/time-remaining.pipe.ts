import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Pipe({
  name: 'timeRemaining'
})
export class TimeRemainingPipe implements PipeTransform {

  settingsService = inject(SettingsService);

  transform(value: number): string {
    const convertedTime = this.settingsService.convertTime(value);
    let minutes = convertedTime.minutes;
    let seconds = convertedTime.seconds;
    let minutesString = Math.floor(minutes).toString().padStart(2, '0');
    let secondsString = seconds.toString().padStart(2, '0');
    let timeRemaining = minutesString + ':' + secondsString;

    return timeRemaining;
  }

}
