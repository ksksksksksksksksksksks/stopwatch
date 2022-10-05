import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, timer } from 'rxjs';
import { Stopwatch } from './domain/stopwatch';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {

  initialTime = 0;
  stoppedTime: number = this.initialTime;
  timer$: BehaviorSubject<number> = new BehaviorSubject(this.initialTime);
  subscription!: Subscription;
  timerInterval!: number;
  // stopwatchOn: boolean = false;

  constructor() { }

  // public get stopwatch$(): Observable<Stopwatch> {
  // }

  start() {
    this.subscription = timer(0, 10).pipe(
      map(value => value + this.stoppedTime))
      .subscribe(this.timer$);
    // this.stopwatchOn = true;
  }

  reset() {
    this.subscription.unsubscribe();
    this.stoppedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    // this.stopwatchOn = false;
  }

  convertToString(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }

}
