import {Injectable, signal, WritableSignal} from '@angular/core';

export enum Status {
  Idle = 'idle',
  Edit = 'edit'
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  currentStatus: WritableSignal<Status> = signal(Status.Idle);

  setStatus(status: Status) {

    if (this.currentStatus() !== status) {
      this.currentStatus.set(status);
      console.log('%c Set new State: ' + status, 'color: green');
    }
  }
}