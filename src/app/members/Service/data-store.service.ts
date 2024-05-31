import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {Rate} from "../../core/common/rate";
import {FilterService} from "./filter.service";
import {DatabaseService} from "./database.service";

export type ParentOrEdit = {
  rate: Rate;
  parent: boolean;
  edit: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);
  filterService: FilterService = inject(FilterService);

  private rates$ = new BehaviorSubject<Rate[]>([]);
  ratesOb$ = this.rates$.asObservable();
  private ratesTotal$ = new BehaviorSubject<number>(0);
  private parentOrEditRate$ = new BehaviorSubject<ParentOrEdit | null>(null);
  lastEditOrParentRate$  = this.parentOrEditRate$.asObservable();


  constructor() {
    this.filterService.searchOb$.subscribe(search => {
      this.databaseService.getAllRatesWithQuery(search, this.filterService.getSearchArray()).subscribe(response => {
        response.documents.forEach(rate => {
          rate.imageBuckets = JSON.parse(rate.imageBuckets as unknown as string);
        });

        this.rates$.next(response.documents);
        this.ratesTotal$.next(response.total);
        console.log('Update Rates array');
      });
    });
  }

  // Muss von mehr als einer komponente aufgerufen und aboniert werden können.
  // Ergebnis soll aber nur hier verarbeitet werden, daher => tap
  updateRates() {
    return this.databaseService.getAllRatesWithQuery(this.filterService.getSearch(), this.filterService.getSearchArray()).pipe(
      tap(response => {
        response.documents.forEach(rate => {
          rate.imageBuckets = JSON.parse(rate.imageBuckets as unknown as string);
        });

        this.rates$.next(response.documents);
        this.ratesTotal$.next(response.total);
        console.log('Update Rates array');
      })
    );
  }

  getRate(id: string) {
    return this.rates$.value.find(rate => rate.$id === id);
  }

  setEditRate(rate: Rate) {
    console.log('set edit rate');
    const editRate: ParentOrEdit = {
      rate: rate,
      edit: true,
      parent: false
    }
    this.parentOrEditRate$.next(editRate);
  }

  setParentRate(rate: Rate) {
    console.log('set parent rate');
    const parentRate: ParentOrEdit = {
      rate: rate,
      edit: false,
      parent: true
    }
    this.parentOrEditRate$.next(parentRate);
  }

  setEditOrParentRateToNull() {
    console.log('set editOrParentRateToNull');
    this.parentOrEditRate$.next(null);
  }
}
