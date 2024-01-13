import {inject, Injectable} from '@angular/core';
import {DatabaseService} from "../../core/Services/database.service";
import {BehaviorSubject} from "rxjs";
import {RateBook} from "../../core/common/rate-book";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  databaseService: DatabaseService = inject(DatabaseService);

  books = new BehaviorSubject<RateBook[]>([]);

  constructor() {}



  updateBooks() {
    this.databaseService.getAllBooks().subscribe(response => {

      response.forEach(book => {
        book.imageBuckets = JSON.parse(book.imageBuckets as unknown as string);
        book.notes = JSON.parse(book.notes as unknown as string);
      });

      this.books.next(response);
      });

  }




}
