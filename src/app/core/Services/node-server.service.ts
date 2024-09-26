import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {from, map, Observable, tap} from "rxjs";
import {ExecutionMethod, Models} from "appwrite";

@Injectable({
  providedIn: 'root'
})
export class NodeServerService {

  appwriteService = inject(AppwriteService);

  url = 'https://rateme-function.vezept.de';

  checkGlobalRate(parentId: string): Observable<Models.Document> {
    return from(this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      parentId,
      false,
      '/checkGlobalRate',
      ExecutionMethod.GET
    )).pipe(
      tap(result => console.log(result)),
      map(result => result.responseBody as unknown as Models.Document)
    )
  }

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

  async getFunctionStatus(executionId: string) {
    let status: string = '';
    let attempts = 20;
    const retryDelay = 1000;

    while (status !== 'completed' && attempts > 0) {
      console.log('getFunctionStatus start while...');
      attempts--;

      let response = await this.appwriteService.functions.getExecution('65c3cd5f3c2d915cfc15',executionId);
      status = response.status;

      if (status !== 'completed') {
        await this.delay(retryDelay); // Wartezeit zwischen den Versuchen
      }
    }

    console.log('getFunctionStatus return: ' + status);
    return status;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



































}
