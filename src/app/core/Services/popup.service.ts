import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  errorMessage$ = new BehaviorSubject<string>('');

  constructor() {
  }

  setErrorMessage(errorMessage: string) {
    console.log('setErrorMessage: ' + errorMessage);
    this.errorMessage$.next(errorMessage);
  }
}
