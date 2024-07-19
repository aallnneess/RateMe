import { Injectable } from '@angular/core';
import {BehaviorSubject, delay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FullScreenLoaderService {

  loadingStartTime: number = 0;
  minTimeToLoad = 1500;

  private loading$ = new BehaviorSubject<boolean>(false);
  loading = this.loading$.asObservable();

  setLoadingOn() {
    this.loadingStartTime = Date.now();
    this.loading$.next(true);
  }

  setLoadingOff() {
    console.log('setLoadingOff');
    const test = (this.minTimeToLoad - (Date.now() - this.loadingStartTime));

    if (test > 0) {
      setTimeout(() => {
        this.loading$.next(false);
      },test);
    } else {
      this.loading$.next(false);
    }

  }

  constructor() {}
}
