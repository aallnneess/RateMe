import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserInfo} from "../common/user-info";

@Injectable({
  providedIn: 'root'
})
export class NodeServerService {

  http: HttpClient = inject(HttpClient);

  url = 'https://nodeserver.vezept.de/rateme';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getUserWithId(id: string) {
    return this.http.get<UserInfo>(
      `${this.url}/user/${id}`,
      {headers: this.headers}
    );
  }



}
