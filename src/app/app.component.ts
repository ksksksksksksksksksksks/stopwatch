import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { buffer, debounceTime, filter, map, Subject, Subscription } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';
import { StopwatchService } from './stopwatch.service';

const timeBetweenClicks: number = 300;
const numberOfClicks: number = 2;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  public stopwatch!: Stopwatch;
  private subscription: Subscription;
  private click$ = new Subject<Boolean>();
  private subscriptionDbClick: Subscription;

  constructor(public stopwatchService: StopwatchService, private cdr: ChangeDetectorRef) {
    this.subscription = this.stopwatchService.stopwatch$
      .subscribe((value: Stopwatch) => {
        this.stopwatch = value; 
        this.cdr.detectChanges();
      });
    this.subscriptionDbClick = this.click$.pipe(buffer(this.click$.pipe(debounceTime(timeBetweenClicks))),
        map(list => list.length),
        filter(x => x === numberOfClicks))
      .subscribe(num => {
        this.stopwatchService.wait(); 
        this.cdr.detectChanges();
      });
  }

  start() {
    this.stopwatchService.start();
  }

  stop() {
    this.stopwatchService.stop();
  }

  wait() {
    this.click$.next(true);    
  }

  reset() {
    this.stopwatchService.reset();
    this.stopwatchService.start();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionDbClick.unsubscribe();
  }
}
