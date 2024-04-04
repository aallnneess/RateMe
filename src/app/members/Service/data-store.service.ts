import {inject, Injectable} from '@angular/core';
import {DatabaseService} from "../../core/Services/database.service";
import {BehaviorSubject} from "rxjs";
import {Rate} from "../../core/common/rate";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);

  books = new BehaviorSubject<Rate[]>([]);

  constructor() {}



  updateBooks() {
    this.databaseService.getAllRates().subscribe(response => {

      response.forEach(book => {
        book.imageBuckets = JSON.parse(book.imageBuckets as unknown as string);
        book.notes = JSON.parse(book.notes as unknown as string);
      });

      this.books.next(response);
      });

  }




}
