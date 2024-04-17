import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {Databases, ID, Query} from "appwrite";
import {concatMap, from, map, tap} from "rxjs";
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

    rate.imageBuckets = JSON.stringify(rate.imageBuckets);

    return from(this.databases.createDocument(
      this.databaseId,
      this.booksCollectionId,
      ID.unique(),
      this.filterRateProperties(rate)));
  }

  getAllRates() {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.orderDesc(''),
        Query.equal('childRate', false)
      ]
    )).pipe(
      map(response => response.documents as unknown as Rate[]),
      tap(rates => console.log(rates))
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

  updateRating(parentRateId: string, childRate: Rate) {
    return from(this.databases.getDocument(
      this.databaseId,
      this.booksCollectionId,
      parentRateId
    )).pipe(
      map(response => {
        let rate = response as unknown as Rate;
        rate.imageBuckets = JSON.parse(rate.imageBuckets as unknown as string);
        rate.ratings.push(childRate.rating);
        rate.rating = 0;

        for (let i = 0; i < rate.ratings.length; i++) {
          // console.log('updateRating: ' + rate.ratings[i]);
          rate.rating += rate.ratings[i];
        }

        rate.rating = rate.rating / rate.ratings.length;
        // console.log('Ergebnis: ' + rate.rating);

        // add new tags
        let newTags = childRate.tags.replace(rate.tags, '');
        // console.log('Old tags: ' + rate.tags);
        // console.log('New Tags: ' + newTags);
        rate.tags = rate.tags + newTags;
        // console.log('final tags: ' + rate.tags);



        //add new image buckets
        if (typeof childRate.imageBuckets === "string") {
          childRate.imageBuckets = JSON.parse(childRate.imageBuckets);
        }

        if (typeof rate.imageBuckets !== "string" && typeof childRate.imageBuckets !== 'string') {

          for (let i = 0; i < childRate.imageBuckets.length; i++) {
            if (!rate.imageBuckets.includes(childRate.imageBuckets[i])) {
              console.log('Füge 1 Bild aus dem Childrate dem Parentrate hinzu...');
              rate.imageBuckets.push(childRate.imageBuckets[i]);
            }
          }
        } else {
          console.error('rate oder childrate is string!!');
        }

        return rate;
      }),
      concatMap(rate => {

        rate.imageBuckets = JSON.stringify(rate.imageBuckets);

        return from(this.databases.updateDocument(
          this.databaseId,
          this.booksCollectionId,
          parentRateId,
          this.filterRateProperties(rate)
        ));
      })
    )
  }

  filterRateProperties(obj: any): Rate {
    const rate = new Rate(); // Erzeuge ein leeres Rate-Objekt

    // Erstelle ein Set mit den Eigenschaften der Rate-Klasse
    const rateProperties = Object.keys(rate);
    // console.log(rateProperties);

    // Filtere die Eigenschaften des Objekts
    Object.keys(obj).forEach(key => {
      // console.log('key: ' + key);
      if (!rateProperties.includes(key)) {
        // console.log('delete: ');
        // console.log(obj[key]);
        delete obj[key];
      }
    });

    return obj;
  }

  checkIfUserHasRated(userId: string, documentId: string) {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.equal('userId',[userId]),
        Query.equal('$id', documentId)
      ]
    ))
  }




}
