import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private showPopup$ = new BehaviorSubject<boolean>(false);
  showPopupOb$ = this.showPopup$.asObservable();

  private search$ = new BehaviorSubject<string>('');
  searchOb$ = this.search$.asObservable();


  constructor() { }

  showPopup() {
    this.showPopup$.next(true);
  }

  closePopup() {
    this.showPopup$.next(false);
  }

  setSearch(value: string) {
    this.search$.next(value);
    console.log(this.search$.value);
  }

  getSearch() {
    return this.search$.value;
  }

  setSearchToNull() {
    this.search$.next('');
  }
}
