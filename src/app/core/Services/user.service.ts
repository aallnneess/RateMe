import {inject, Injectable, signal} from '@angular/core';
import {ExecutionMethod, Models} from "appwrite";
import {AppwriteService} from "./appwrite.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = signal<Models.User<Models.Preferences> | null>(null);

  appwriteService = inject(AppwriteService);

  constructor() { }

  async loadUser(userId: string) {
    // get user
    const user = await this.getUser(userId);
    if (user) {
      this.user.set(user);
      console.log('User ' + this.user()?.email + ' loaded.');
    }
  }

  private async getUser(id: string) {
    const response = await this.appwriteService.functions.createExecution(
      '65c3cd5f3c2d915cfc15',
      id,
      false,
      '/user',
      ExecutionMethod.GET
    );

    const user: Models.User<Models.Preferences> = await JSON.parse(response.responseBody);
    return user;
  }
}
