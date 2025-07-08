import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRemaining'
})
export class TimeRemainingPipe implements PipeTransform {

  transform(value: number): string {
    let minutes = value / 60000;
    let seconds = value % 60000 / 1000;
    let minutesString = Math.floor(minutes).toString().padStart(2, '0');
    let secondsString = seconds.toString().padStart(2, '0');
    let timeRemaining = minutesString + ':' + secondsString;

    return timeRemaining;
  }

}
