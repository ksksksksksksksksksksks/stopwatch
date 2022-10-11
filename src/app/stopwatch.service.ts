import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, timer } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';

const initialTime: number = 0;

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {

  public isStarted: boolean = false;
  private stoppedTime: number = initialTime;
  private timer$: BehaviorSubject<number> = new BehaviorSubject(initialTime);
  private subscription!: Subscription;
  private secondInterval: number = 0;
  
  constructor() { }

  public get stopwatch$(): Observable<Stopwatch> {
    return this.timer$.pipe(
      map((milliseconds: number): Stopwatch => this.getTime(milliseconds))
    );
  }

  start() {
    this.subscription = timer(0, 100).pipe(
      map((value: number): number => value + this.stoppedTime))
    .subscribe(this.timer$);
    this.isStarted = true;
  }

  reset() {
    this.subscription.unsubscribe();
    this.stoppedTime = initialTime;
    this.timer$.next(initialTime);
  }

  stop() {
    this.reset();
    this.isStarted = false;
  }

  wait() {
    this.subscription.unsubscribe();
    this.stoppedTime = this.timer$.value;
    this.isStarted = false;
  }

  convertNumToStr(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }

  getTime(msecond: number): Stopwatch {
    let milliseconds = msecond % 10;
    if (msecond % 10 === 0) {
      this.secondInterval = msecond / 10;
    }
    let seconds = this.secondInterval % 60;
    let minutes = Math.floor((msecond % 36000) / 600);
    let hours = Math.floor(msecond / 36000);

    return {
      hours: this.convertNumToStr(hours),
      minutes: this.convertNumToStr(minutes),
      seconds: this.convertNumToStr(seconds),
      milliseconds: milliseconds + '',
    };
  }
}
