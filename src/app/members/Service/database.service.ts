import {inject, Injectable} from '@angular/core';
import {Databases, ID, Query} from "appwrite";
import {from, map, Observable, tap} from "rxjs";
import {AppwriteService} from "../../core/Services/appwrite.service";
import {Rate, RateResponse} from "../../core/common/rate";
import {RateContainer} from "../../core/common/rate-container";
import {FilterService} from "./filter.service";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  appwriteService: AppwriteService = inject(AppwriteService);
  databases!: Databases;
  databaseId = '657334ccc654783e43fe';

  filterService = inject(FilterService);

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
      <RateResponse>{
        $id: rate.$id,
        rating: rate.rating,
        active: rate.active,
        childRate: rate.childRate,
        imageBuckets: rate.imageBuckets,
        notesCollectionId: rate.notesCollectionId,
        parentDocumentId: rate.parentDocumentId,
        rateTopic: rate.rateTopic,
        quelle: rate.quelle,
        boughtAt: rate.boughtAt,
        userId: rate.userId,
        tags: rate.tags,
        title: rate.title,
        manufacturer: rate.manufacturer,
        username: rate.username,
        globalRating: rate.globalRating
      }
    ));
  }

  updateRate(rate: Rate) {
    rate.imageBuckets = JSON.stringify(rate.imageBuckets);
    rate.imageBucketsGlobal = JSON.stringify(rate.imageBucketsGlobal);

    // const filteredRate = this.filterRateProperties(rate);

    return from(this.databases.updateDocument(
      this.databaseId,
      this.booksCollectionId,
      rate.$id,
      <RateResponse>{
        $id: rate.$id,
        rating: rate.rating,
        active: rate.active,
        childRate: rate.childRate,
        imageBuckets: rate.imageBuckets,
        notesCollectionId: rate.notesCollectionId,
        parentDocumentId: rate.parentDocumentId,
        rateTopic: rate.rateTopic,
        quelle: rate.quelle,
        boughtAt: rate.boughtAt,
        userId: rate.userId,
        tags: rate.tags,
        title: rate.title,
        manufacturer: rate.manufacturer,
        username: rate.username
      }
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

  getAllParentRatesWithQuery(search: string, paginationLimit: number, paginationOffset: number, searchWords?: string[]) {

    let querys: Observable<RateContainer>[] = [];
    let allQueries: string[] = [];

    if (searchWords) {

      if (searchWords.length > 0) {

        searchWords.forEach(word => {
          allQueries.push(
            Query.or([
              Query.contains('title', word),
              Query.contains('tags', word),
              Query.contains('boughtAt', word)
            ]),
          );
        });

        if (search.length > 0) {
          allQueries.push(
            Query.or([
              Query.contains('title', search),
              Query.contains('tags', search),
              Query.contains('boughtAt', search)
            ]),
          );
        }

      } else {
        allQueries.push(
          Query.or([
            Query.contains('title', search),
            Query.contains('tags', search),
            Query.contains('boughtAt', search)
          ]),
        );
      }
    }

    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        Query.limit(paginationLimit),
        Query.offset(paginationOffset),
        Query.orderDesc('globalRating'),
        Query.equal('childRate', false),
        ...allQueries,
        Query.or([
          Query.equal('rateTopic', this.filterService.getCheckedRecipe() ? 'recipe' : ''),
          Query.equal('rateTopic', this.filterService.getCheckedProduct() ? 'product' : '')
        ]),
      ]
    )).pipe(
      map(response => response as unknown as RateContainer),
      tap(rates => console.log(rates))
    )
  }

  getRateById(id: string) {
    console.log('getRateById');
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
    console.log('getRateByUserIdAndParentDocumentId');
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
    //console.log(parentDocumentId);
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

  getRatesByParentDocumentIds(parentDocumentIds: string[]) {

    let queries = Query.contains('parentDocumentId', parentDocumentIds);

    // if no parentDocumentIds, Query.contains throws error, so we use Query.equal
    if (parentDocumentIds.length === 0) {
      queries = Query.equal('parentDocumentId', 'no queries')
    }

    return from(this.databases.listDocuments(
      this.databaseId,
      this.booksCollectionId,
      [
        queries
      ]
    )).pipe(
      map(response => response.documents as unknown as Rate[])
    );
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






}
