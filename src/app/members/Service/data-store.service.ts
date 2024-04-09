import {inject, Injectable} from '@angular/core';
import {DatabaseService} from "../../core/Services/database.service";
import {BehaviorSubject} from "rxjs";
import {Rate} from "../../core/common/rate";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);

  rates = new BehaviorSubject<Rate[]>([]);

  constructor() {}



  updateRates() {
    this.databaseService.getAllRates().subscribe(response => {

      response.forEach(rate => {
        rate.imageBuckets = JSON.parse(rate.imageBuckets as unknown as string);
        // rate.notes = JSON.parse(rate.notes as unknown as string);
      });

      this.rates.next(response);
      });

  }

  getRate(id: string) {
    return this.rates.value.find(rate => rate.$id === id);
  }



}
