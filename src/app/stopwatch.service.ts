import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, timer } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {

  initialTime: number = 0;
  stoppedTime: number = this.initialTime;
  timer$: BehaviorSubject<number> = new BehaviorSubject(this.initialTime);
  subscription!: Subscription;
  secondInterval: number = 0;
  constructor() { }

  public get stopwatch$(): Observable<Stopwatch> {
    return this.timer$.pipe(
      map((milliseconds: number): Stopwatch => this.getTime(milliseconds))
    );
  }

  start() {
    this.subscription = timer(0, 100).pipe(
      map((value: number): number => {
        console.log(value + this.stoppedTime);
        return value + this.stoppedTime;
      }))
      .subscribe(this.timer$);
  }

  reset() {
    this.subscription.unsubscribe();
    this.stoppedTime = this.initialTime;
    this.timer$.next(this.initialTime);
  }

  wait() {
    this.stoppedTime = this.timer$.value;
    this.subscription.unsubscribe();
  }

  numToStr(value: number): string {
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
      hours: this.numToStr(hours),
      minutes: this.numToStr(minutes),
      seconds: this.numToStr(seconds),
      milliseconds: milliseconds + '',
      started: !!msecond
    };
  }
}
