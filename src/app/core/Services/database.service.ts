import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {Databases, ID, Query} from "appwrite";
import {concatMap, finalize, from, map, of, tap} from "rxjs";
import {Rate} from "../common/rate";
import {RateContainer} from "../common/rate-container";

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
      rate
    ));
  }

  updateRate(rate: Rate) {
    rate.imageBuckets = JSON.stringify(rate.imageBuckets);

    return from(this.databases.updateDocument(
      this.databaseId,
      this.booksCollectionId,
      rate.$id,
      this.filterRateProperties(rate)
    ))
  }

  getAllRates() {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.orderDesc('globalRating'),
        Query.equal('childRate', false)
      ]
    )).pipe(
      map(response => response as unknown as RateContainer),
      tap(rates => console.log(rates))
    );
  }

  getAllRatesWithQuery(query: string) {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.orderDesc('globalRating'),
        Query.equal('childRate', false),
        Query.or([
          Query.contains('title', query),
          Query.contains('tagsGlobal', query),
          Query.contains('boughtAtGlobal', query)
        ])
      ]
    )).pipe(
      map(response => response as unknown as RateContainer),
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

  // We need the "parent/original" Rate Id and the userId
  // Then we search if theres a child rate with parentDocumentId & userId
  getRateByUserIdAndParentDocumentId(userId: string, rateId: string) {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.equal('parentDocumentId', rateId),
        Query.equal('userId', userId)
      ]
    )).pipe(
      map(response => {
        if (response.documents.length === 1) {
          return response.documents[0] as unknown as Rate
        }else if (response.documents.length > 1) {
          console.error('Zu viele Rates gefunden, es kann eig. nur eine geben!');
          return response.documents[0] as unknown as Rate;
        }else {
          console.error('Keine Rate gefunden !');
          return null;
        }
      })
    )
  }

  getRatesByParentDocumentId(parentDocumentId: string) {
    console.log(parentDocumentId);
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.equal('parentDocumentId', parentDocumentId),
      ]
    )).pipe(
      map(response => response.documents as unknown as Rate[])
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

  checkIfUserHasRated(userId: string, notesCollectionId: string) {
    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.equal('userId',[userId]),
        Query.equal('notesCollectionId', notesCollectionId)
      ]
    ))
  }

  updateParentsGlobalAttributes(parentDocumentId: string) {
    //console.log(' XXX ');
    const ratings: Rate[] = [];
    let globalRating: number = 0;
    let tagsGlobal = '';
    let boughtAtGlobal = '';

    return from(this.databases.getDocument(
      this.databaseId,
      this.booksCollectionId,
      parentDocumentId
    )).pipe(
      map(response => response as unknown as Rate),
      tap(parentRate => {
        //console.log('Get Parentrate...');
        ratings.push(parentRate);
        //console.log('Size of ratings Array after adding Parentrate: ' + ratings.length);
      }),
      concatMap(() => {
        return from(this.databases.listDocuments(
          this.databaseId,
          this.booksCollectionId,
          [
            Query.equal('parentDocumentId', parentDocumentId)
          ]
        )).pipe(
          map(response => response.documents as unknown as Rate[]),
          tap(rates => {
            //console.log('Get ' + rates.length + ' Child Rates.');
            ratings.push(...rates);
            //console.log('Size of ratings Array after adding childs: ' + ratings.length);

            // GlobalRating calculation #######################################################

            for (let rating of ratings) {
              globalRating += rating.rating;
            }

            globalRating = globalRating / ratings.length;

            // tagsGlobal concats #######################################################

            for (let rating of ratings) {
              tagsGlobal += rating.tags;
            }

            // boughtAtGlobal concats #######################################################

            for (let rating of ratings) {
              boughtAtGlobal += rating.boughtAt + ' ';
            }



          })
        )
      }),
      concatMap(() => {

        //console.log(globalRating);
        return from(this.databases.updateDocument(
          this.databaseId,
          this.booksCollectionId,
          parentDocumentId,
          {
            globalRating: globalRating,
            tagsGlobal: tagsGlobal,
            boughtAtGlobal: boughtAtGlobal,
          }
        ))
      }),
      finalize(() => {
        console.log('global rating successfully updated to ' + globalRating);
        //console.log(' XXX ');
      })
    );
  }




}
