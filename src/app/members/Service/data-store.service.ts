import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {Rate} from "../../core/common/rate";
import {FilterService} from "./filter.service";
import {DatabaseService} from "./database.service";
import {FullScreenLoaderService} from "../../shared/services/full-screen-loader.service";

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
  fullscreenLoaderService = inject(FullScreenLoaderService);

  private rates$ = new BehaviorSubject<Rate[]>([]);
  ratesOb$ = this.rates$.asObservable();
  private ratesTotal$ = new BehaviorSubject<number>(0);
  private parentOrEditRate$ = new BehaviorSubject<ParentOrEdit | null>(null);
  lastEditOrParentRate$  = this.parentOrEditRate$.asObservable();

  paginationLimit = 20;
  paginationOffset = 0;
  paginationStep = 20;
  private documentHeightLastPagination = 0;

  doPagination() {
    this.paginationOffset += this.paginationStep;
    console.log('offset: ' + this.paginationOffset);
    return this.updateRates();
  }


  constructor() {

    this.filterService.searchOb$.subscribe(search => {

      this.paginationOffset = 0;
      this.documentHeightLastPagination = 0;
      this.databaseService.getAllRatesWithQuery(search, this.paginationLimit, this.paginationOffset, this.filterService.getSearchArray()).subscribe(response => {
        response.documents.forEach(rate => {
          rate.imageBucketsGlobal = JSON.parse(rate.imageBucketsGlobal as unknown as string);
        });

        this.rates$.next(response.documents);
        this.ratesTotal$.next(response.total);
        console.log('Update Rates array');
        this.fullscreenLoaderService.setLoadingOff();

      });
    });
  }

  // Muss von mehr als einer komponente aufgerufen und aboniert werden können.
  // Ergebnis soll aber nur hier verarbeitet werden, daher => tap
  updateRates() {
    return this.databaseService.getAllRatesWithQuery(this.filterService.getSearch(),this.paginationLimit, this.paginationOffset, this.filterService.getSearchArray()).pipe(
      tap(response => {
        response.documents.forEach(rate => {
          rate.imageBucketsGlobal = JSON.parse(rate.imageBucketsGlobal as unknown as string);
        });

        if (this.paginationOffset > 0) {


          for (let rate of response.documents) {
            this.rates$.value.push(rate);
          }

          console.log('Update Rates array pagination');
        } else {
          this.rates$.next(response.documents);
          //console.log(response.documents);
          this.ratesTotal$.next(response.total);
          console.log('Update Rates array');
          //this.fullscreenLoaderService.setLoadingOff();
        }


      })
    );
  }

  getRate(id: string) {
    return this.rates$.value.find(rate => rate.$id === id);
  }

  setEditRate(rate: Rate) {
    console.log('set edit rate');
    console.log(rate);
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
    this.fullscreenLoaderService.setLoadingOff();
    this.parentOrEditRate$.next(null);
  }


  setDocumentHeightLastPagination(value: number) {
    this.documentHeightLastPagination = value;
  }

  getDocumentHeightLastPagination() {
    return this.documentHeightLastPagination;
  }

  getRatesSize() {
    return this.rates$.value.length;
  }

  getTotalResizeCount() {
    return this.ratesTotal$.value;
  }



}
