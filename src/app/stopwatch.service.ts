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
  timerInterval: number = 0;
  // stopwatchOn: boolean = false;

  constructor() { }

  // public get stopwatch$(): Observable<Stopwatch> {
  //   return this.timer$.pipe(
  //     map((milliseconds: number): Stopwatch => this.msToStopwatch(milliseconds))
  //   );
  // }

  start() {
    this.subscription = timer(0, 100).pipe(
      map(value => value + this.stoppedTime))
      .subscribe(val => {
        console.log('timer:', val); 
        this.msToStopwatch(val)});
      // .subscribe(this.timer$);
      console.log(this.subscription);
    // this.stopwatchOn = true;
  }

  reset() {
    this.subscription.unsubscribe();
    this.stoppedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    // this.stopwatchOn = false;
  }

  numToString(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }

  msToStopwatch(milliseconds: number): Stopwatch {
    let hundredth = milliseconds % 10;
    console.log('hundredth:', hundredth);
    let ms = hundredth;
    console.log('ms:', ms);
    if (ms % 10 === 0) {
      this.timerInterval = Math.floor(ms / 10);
    }
    console.log('timerInterval:', this.timerInterval);
    let seconds = this.timerInterval % 60;
    console.log('seconds:', seconds);
    let hours = Math.floor(ms / 36000);
    hundredth = ms % 36000;
    let minutes = Math.floor(hundredth / 600);

    return {
      hours: this.numToString(hours),
      minutes: this.numToString(minutes),
      seconds: this.numToString(seconds),
      milliseconds: ms + ''
    };
  }

}
