import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {
  concat,
  defer, delay, finalize,
  forkJoin,
  from,
  ignoreElements,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  tap,
  throwError
} from "rxjs";
import {CollectionResponse} from "../common/collection-response";
import {ExecutionMethod} from "appwrite";

@Injectable({
  providedIn: 'root'
})
export class NodeServerService {

  appwriteService = inject(AppwriteService);

  url = 'https://rateme-function.vezept.de';

  getUserWithId(id: string) {

    return from(this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      id,
      false,
      '/user',
      ExecutionMethod.GET
    )).pipe(
      map(result => JSON.parse(result.responseBody) as unknown as UserInfo)
    );

  }

  createNotesCollection(rateTitle: string) {

    return from(this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      rateTitle,
      false,
      '/newNotesCollection',
      ExecutionMethod.GET
    )).pipe(
      map(result => {
        if (result.responseBody) {
          return JSON.parse(result.responseBody) as unknown as CollectionResponse;
        } else {
          throw new Error('Empty Response Body: ' + result.responseBody);
        }
      })
    )
  }


  // TODO: createNotesCollection neu geschrieben mit retry. If prüft möglicherweise das falsche....
  // createNotesCollection(rateTitle: string) {
  //   let retryCount = 0;
  //   return defer(() => {
  //     return from(this.appwriteService.functions.createExecution(
  //       '65c3cd5f3c2d915cfc15',
  //       rateTitle,
  //       false,
  //       '/newNotesCollection',
  //       ExecutionMethod.GET
  //     )).pipe(
  //       tap(() => retryCount++),
  //       mergeMap(response => {
  //         if (!response.responseBody || response.responseBody.length < 1) {
  //           return throwError(() => {
  //             return 'createNotesCollection error. ' + retryCount + ' mal Versucht';
  //           });
  //         }
  //         return of(JSON.parse(response.responseBody) as unknown as CollectionResponse);
  //       })
  //     );
  //   }).pipe(
  //     retry({ count: 10, delay: 1000 })
  //   );
  // }

































}
