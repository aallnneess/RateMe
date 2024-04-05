import { Injectable } from '@angular/core';
import {Account, Client, Databases, Functions} from "appwrite";

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {

  client = new Client();
  account!: Account;
  functions!: Functions;
  databases!: Databases;


  constructor() {
    this.client
      .setEndpoint('https://appwrite.vezept.de/v1')
      .setProject('655ddf410aea74f215c4');

    this.account = new Account(this.client);
    this.functions = new Functions(this.client);
    this.databases = new Databases(this.client);
  }

}
