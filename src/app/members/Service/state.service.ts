import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";


export enum Status {
  Idle = 'idle',
  Edit = 'edit'
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  router = inject(Router);

  browserHistory: string[] = [];

  currentStatus: WritableSignal<Status> = signal(Status.Idle);
  membersScrollYPosition: WritableSignal<[number,number]> = signal([0,0]);


  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const url = event.url.length > 20 ? event.url.substring(0,40) : event.url;
        this.browserHistory.push(url);
      }
    });
  }

  setStatus(status: Status) {

    if (this.currentStatus() !== status) {
      this.currentStatus.set(status);
      console.log('%c Set new State: ' + status, 'color: green');
    }
  }

  getPreviousUrl(): string | undefined {
    return this.browserHistory.length > 1 ? this.browserHistory[this.browserHistory.length - 2] : undefined;
  }
}
