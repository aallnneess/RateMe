import {inject, Injectable} from '@angular/core';
import {DatabaseService} from "../../core/Services/database.service";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {Rate} from "../../core/common/rate";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);

  private rates$ = new BehaviorSubject<Rate[]>([]);
  ratesOb$ = this.rates$.asObservable();
  private ratesTotal$ = new BehaviorSubject<number>(0);

  constructor() {}

  // Muss von mehr als einer komponente aufgerufen und aboniert werden können.
  // Ergebnis soll aber nur hier verarbeitet werden, daher => tap
  updateRates() {
    return this.databaseService.getAllRates().pipe(
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

  getRatesValue() {
    return this.rates$.value;
  }

  // TODO: evtl. übertrieben.....
  checkForNewRate() {
    return this.databaseService.getAllRates().subscribe(result => {
      if (result.total !== this.ratesTotal$.value) {
        console.log('New Data for Rates[]');

        this.updateRates().subscribe();

      }
    });
  }


  getRate(id: string) {
    return this.rates$.value.find(rate => rate.$id === id);
  }
}
