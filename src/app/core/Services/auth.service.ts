import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {catchError, finalize, from, of, tap, throwError} from "rxjs";
import {Models} from "appwrite";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: WritableSignal<Models.Session|null> = signal(null);

  appwrite = inject(AppwriteService);

  constructor() {}

  login(email: string, password: string) {
    return from(this.appwrite.account.createEmailSession(
      email,
      password
    )).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(err => {
        return throwError(() => {
          return err.message
        })
      })
    );
  }

  setSession(session: Models.Session) {
    console.log(session);
  }
}
