import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';
import { StopwatchService } from './stopwatch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  stopwatch$: Observable<Stopwatch>;

  constructor(private stopwatchService: StopwatchService) {
    this.stopwatch$ = this.stopwatchService.stopwatch$;
  }

  start() {
    this.stopwatchService.start();
  }

  stop() {
    this.stopwatchService.reset();
  }

  wait() {
    this.stopwatchService.wait();
  }

  reset() {
    this.stopwatchService.reset();
    this.stopwatchService.start();
  }
}
