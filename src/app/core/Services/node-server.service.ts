import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {from, map} from "rxjs";
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

  createNotesCollection(
    rateTitle: string,
    rateId: string,
    rateDatabaseId: string,
    rateCollectionId: string,
    message: string,
    username: string,
    userId: string,
    date: number
    ) {

    const data = {
      title: rateTitle,
      rateId: rateId,
      rateDatabaseId: rateDatabaseId,
      rateCollectionId: rateCollectionId,
      message,
      username,
      userId,
      date
    };

    return from(this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      JSON.stringify(data),
      true,
      '/newNotesCollection',
      ExecutionMethod.GET
    ))
  }



































}
