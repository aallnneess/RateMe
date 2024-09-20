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

  private toggleAnimationSub$ = new BehaviorSubject<boolean>(false);
  toggleAnimation = this.toggleAnimationSub$.asObservable();

  setLoadingOn() {
    this.loadingStartTime = Date.now();
    this.toggleAnimationSub$.next(true);
    this.loading$.next(true);
  }

  setLoadingOff() {
    //console.log('setLoadingOff');
    const test = (this.minTimeToLoad - (Date.now() - this.loadingStartTime));
    //console.log(test);

    if (test > 0) {
      setTimeout(() => {
        this.setLoadingFalse();
      },test);
    } else {
      this.setLoadingFalse();
    }

  }

  private setLoadingFalse() {
    //console.log('setLoadingFalse');
    this.toggleAnimationSub$.next(false);
    setTimeout(() => {
      this.loading$.next(false);
    },1000);  // <== Sollte der Wert geändert werden, muss auch im fullscreen-spinner.component.css die animationszeit geändert werden !

  }

  constructor() {}
}
