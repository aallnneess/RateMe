import {inject, Injectable} from '@angular/core';
import {DatabaseService} from "../../core/Services/database.service";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {Rate} from "../../core/common/rate";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);
  rates = new BehaviorSubject<Rate[]>([]);


  constructor() {}

  // Muss von mehr als einer komponente aufgerufen und aboniert werden können.
  // Ergebnis soll aber nur hier verarbeitet werden, daher => tap
  updateRates() {
    return this.databaseService.getAllRates().pipe(
      tap(response => {
        response.forEach(rate => {
          rate.imageBuckets = JSON.parse(rate.imageBuckets as unknown as string);
        });

        this.rates.next(response);
        console.log('set rates...');
      })
    );

  }




  getRate(id: string) {
    return this.rates.value.find(rate => rate.$id === id);
  }



}
