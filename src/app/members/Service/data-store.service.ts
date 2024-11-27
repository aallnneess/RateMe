import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, map, tap} from "rxjs";
import {Rate} from "../../core/common/rate";
import {FilterService} from "./filter.service";
import {DatabaseService} from "./database.service";
import {FullScreenLoaderService} from "../../shared/services/full-screen-loader.service";
import {BucketResponse} from "../../core/common/bucket-response";

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

    // TODO: Pagination wird auch ausgelöst wenn es einfach weniger als 20 Cards gibt und man den boden erreicht....
    // Problem wird hiermit gelöst
    if (this.ratesTotal$.value <= this.paginationStep) {
      this.paginationOffset = 0;
    }

    return this.updateRates();
  }


  constructor() {

    this.filterService.searchOb$.subscribe(search => {

      this.paginationOffset = 0;
      this.documentHeightLastPagination = 0;
      this.databaseService.getAllParentRatesWithQuery(search, this.paginationLimit, this.paginationOffset, this.filterService.getSearchArray()).pipe(
        tap(response => this.ratesTotal$.next(response.total)),
        concatMap(response => this.getAllImages(response.documents))
      ).subscribe(rates => {
        this.rates$.next(rates);
        console.log('Init Rates array');
        this.fullscreenLoaderService.setLoadingOff();

      });
    });
  }

  // Muss von mehr als einer komponente aufgerufen und aboniert werden können.
  // Ergebnis soll aber nur hier verarbeitet werden, daher => tap
  updateRates() {
    return this.databaseService.getAllParentRatesWithQuery(this.filterService.getSearch(),this.paginationLimit, this.paginationOffset, this.filterService.getSearchArray()).pipe(
      tap((r) => {
        this.ratesTotal$.next(r.total);
      }),
      concatMap(response => this.getAllImages(response.documents)),
      tap(recipes => {

        if (this.paginationOffset > 0) {

          // Set of ids from rates$ array
          const existingIds = new Set(this.rates$.value.map(r => r.$id));

          // check if new rate already in the array
          for (let rate of recipes) {
            if (!existingIds.has(rate.$id)) {
              this.rates$.value.push(rate);
            }
          }

          console.log('Update Rates array pagination');
        } else {
          this.rates$.next(recipes);
          console.log('Update Rates array');
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


  getAllImages(rates: Rate[]) {
    console.log('getAllImages');

    // Initialisiere die imageBucketsGlobal für jede Rate
    // Füge parent rate.rating zur parentGlobalRating hinzu
    // Ebenfalls tags/bought
    rates.forEach(rate => {
      rate.imageBucketsGlobal = JSON.parse(rate.imageBuckets as string) as BucketResponse[];
      rate.parentGlobalRating.push(rate.rating);
      rate.tagsGlobal = rate.tags;
      rate.boughtAtGlobal = rate.boughtAt;
    });

    // Extrahiere die Parent-Rate-IDs, um sie auf einmal abzufragen
    const parentRateIds = rates.map(rate => rate.$id);

    // Nutze getRatesByParentDocumentIds, um alle Child-Rates auf einmal zu laden
    return this.databaseService.getRatesByParentDocumentIds(parentRateIds).pipe(
      tap(childRates => {
        childRates.forEach(childRate => {
          // Finde das passende Parent-Rate anhand der parentDocumentId
          const parentRate = rates.find(rate => rate.$id === childRate.parentDocumentId);

          if (parentRate) {
            // Parsen der imageBuckets von jeder Child-Rate
            childRate.imageBuckets = JSON.parse(childRate.imageBuckets as string) as BucketResponse[];

            // Füge die Buckets von Child-Rate zu parentRate.imageBucketsGlobal hinzu
            if (typeof parentRate.imageBucketsGlobal !== 'string')
            parentRate.imageBucketsGlobal = [
              ...parentRate.imageBucketsGlobal,
              ...childRate.imageBuckets
            ];

            // globalRating
            parentRate.parentGlobalRating.push(childRate.rating);

            // tagsGlobal
            parentRate.tagsGlobal += childRate.tags;

            // boughtAtGlobal
            parentRate.boughtAtGlobal +=', ' + childRate.boughtAt;


          }
        });
      }),
      map(() => rates) // Gibt die verarbeiteten Rates zurück
    );
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
