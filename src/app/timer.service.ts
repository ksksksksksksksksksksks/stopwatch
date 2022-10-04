import { Injectable } from '@angular/core';
import { BehaviorSubject, map, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  initialTime = 0;
  timer$: BehaviorSubject<number> = new BehaviorSubject(this.initialTime);
  stopedTime: number = this.initialTime;

  constructor() { }

  start() {
    timer(0, 10).pipe(
      map((value: number): number => value + this.stopedTime))
      .subscribe(this.timer$);
  }
}
