import {inject, Injectable} from '@angular/core';
import {UserInfo} from "../common/user-info";
import {AppwriteService} from "./appwrite.service";
import {from, map} from "rxjs";

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
      'GET',
      { 'X-Custom-Header': '123' }
    )).pipe(
      map(result => JSON.parse(result.responseBody) as unknown as UserInfo)
    )


    // return this.http.get<UserInfo>(
    //   `${this.url}/user/${id}`,
    //   {headers: this.headers}
    // );
  }



}
