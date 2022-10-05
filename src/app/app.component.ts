import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';
import { StopwatchService } from './stopwatch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  stopwatch!: Stopwatch;
  startBtn: boolean = true;
  subscriptions: Subscription = new Subscription();

  constructor(private stopwatchService: StopwatchService) {
  }

  start() {
    this.startBtn = false;
    this.stopwatchService.start();
  }

  stop() {
    this.startBtn = true;
    this.stopwatchService.reset();
  }

  wait() {
  }

  reset() {
    this.stopwatchService.reset();
    this.stopwatchService.start();
  }
}
