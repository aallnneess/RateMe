import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {Databases, ID} from "appwrite";
import {from} from "rxjs";
import {RateBook} from "../common/rate-book";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  appwriteService: AppwriteService = inject(AppwriteService);
  databases!: Databases;
  databaseId = '657334ccc654783e43fe';

  booksCollectionId = '6573366c695cfcbc957a';
  constructor() {
    this.databases = new Databases(this.appwriteService.client);
  }

  addBookRate(rateBook: RateBook) {
    return from(this.databases.createDocument(
      this.databaseId,
      this.booksCollectionId,
      ID.unique(),
      {
        recipeName: rateBook.recipeName,
        source: rateBook.source,
        rating: rateBook.rating,
        notes: rateBook.notes,
        tags: rateBook.tags,
        imageBuckets: JSON.stringify(rateBook.imageBuckets)
      }));
  }



}
