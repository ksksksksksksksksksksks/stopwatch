import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { buffer, bufferTime, debounceTime, filter, map, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';
import { StopwatchService } from './stopwatch.service';

const timeBetweenClicks: number = 300;
const numberOfClicks: number = 2;

function bufferMapFilter(closingNotifier: Observable<any>): OperatorFunction<any, any> {
  return (store: Observable<any>) => store
    .pipe(
      buffer(closingNotifier),
      map(list => list.length),
      filter(x => x === numberOfClicks)
    );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  public stopwatch!: Stopwatch;
  private subscription!: Subscription;
  private click$ = new Subject<Boolean>();
  private subscriptionDbClick!: Subscription;

  constructor(public stopwatchService: StopwatchService, 
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription = this.stopwatchService.stopwatch$
    .subscribe((value: Stopwatch) => {
      this.stopwatch = value;
      this.cdr.detectChanges();
    });

    this.subscriptionDbClick = this.click$.pipe(
      bufferMapFilter(this.click$.pipe(
        debounceTime(timeBetweenClicks)
      ))
    )
    .subscribe(() => {
      this.stopwatchService.wait();
      this.cdr.detectChanges();
    });

    // this.subscriptionDbClick = this.click$.pipe(
    //   bufferTime(timeBetweenClicks),
    //   map(list => list.length),
    //   filter(x => x === numberOfClicks))
    // .subscribe(() => {
    //   this.stopwatchService.wait();
    //   this.cdr.detectChanges();
    // });
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
