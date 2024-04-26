import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {from, map, mergeMap, of, retry, throwError} from "rxjs";
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

  // createNotesCollection(rateTitle: string) {
  //
  //   return from(this.appwriteService.functions.createExecution(
  //     '65c3cd5f3c2d915cfc15',
  //     rateTitle,
  //     false,
  //     '/newNotesCollection',
  //     ExecutionMethod.GET
  //   )).pipe(
  //     map(result => {
  //       if (result.responseBody) {
  //         return JSON.parse(result.responseBody) as unknown as CollectionResponse;
  //       } else {
  //         throw new Error('Empty Response Body: ' + result.responseBody);
  //       }
  //     })
  //   )
  // }


  // TODO: createNotesCollection neu geschrieben mit retry

  createNotesCollection(rateTitle: string) {

    return from(this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      rateTitle,
      false,
      '/newNotesCollection',
      ExecutionMethod.GET
    )).pipe(
      mergeMap(result => result.responseBody.length > 1 ? of(JSON.parse(result.responseBody) as unknown as CollectionResponse) : throwError(() => 'Error while creating notes')),
      retry(10)
    )
  }


}
