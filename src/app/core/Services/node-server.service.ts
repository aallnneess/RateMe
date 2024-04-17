import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {from, map} from "rxjs";
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
      map(result => JSON.parse(result.responseBody) as unknown as CollectionResponse)
    )
  }


}
