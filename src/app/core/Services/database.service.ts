import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {Databases, ID, Query} from "appwrite";
import {from, map} from "rxjs";
import {Rate} from "../common/rate";

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

  addRate(rate: Rate) {
    return from(this.databases.createDocument(
      this.databaseId,
      this.booksCollectionId,
      ID.unique(),
      {
        title: rate.title,
        rating: rate.rating,
        notesCollectionId: rate.notesCollectionId,
        tags: rate.tags,
        imageBuckets: JSON.stringify(rate.imageBuckets),
        username: rate.username,
        userId: rate.userId,
        quelle: rate.quelle
      }));
  }

  getAllRates() {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [Query.orderDesc('')]
    )).pipe(
      map(response => response.documents as unknown as Rate[])
    );
  }

  getRateById(id: string) {
    return from(this.databases.getDocument(
      this.databaseId,
      this.booksCollectionId,
      id
    )).pipe(
      map(response => response as unknown as Rate)
    );
  }



}
