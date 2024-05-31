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

  private searchArray$ = new BehaviorSubject<string[]>([]);
  searchArrayOb$ = this.searchArray$.asObservable();

  private checkedRecipe$ = new BehaviorSubject<boolean>(true);
  checkedRecipeObservable = this.checkedRecipe$.asObservable();
  private checkedProduct$ = new BehaviorSubject<boolean>(true);
  checkedProductObservable = this.checkedProduct$.asObservable();


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

  addSearchToSearchArray(search: string) {
    let searchArray = this.searchArray$.value;
    searchArray.push(search);
    this.searchArray$.next(searchArray);
    this.setSearchToNull();
  }

  removeSearchFromSearchArray(search: string) {
    let searchArray = this.searchArray$.value;
    searchArray.splice(searchArray.indexOf(search), 1);
    this.searchArray$.next(searchArray);
    // to trigger data-store getAllRatesWithQuery...
    this.search$.next(this.search$.value);
  }

  getSearchArray() {
    return this.searchArray$.value;
  }

  setCheckedRecipe(checkedRecipe: boolean) {
    this.checkedRecipe$.next(checkedRecipe);
    console.log(this.checkedRecipe$.value);
  }

  setCheckedProduct(checkedProduct: boolean) {
    this.checkedProduct$.next(checkedProduct);
    console.log(this.checkedProduct$.value);
  }

  getCheckedRecipe() {
    return this.checkedRecipe$.value;
  }

  getCheckedProduct(){
    return this.checkedProduct$.value;
  }


}
