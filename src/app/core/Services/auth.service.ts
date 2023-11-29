import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {catchError, finalize, from, of, tap, throwError} from "rxjs";
import {Models} from "appwrite";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: WritableSignal<Models.Session|null> = signal(null);

  appwrite = inject(AppwriteService);
  router = inject(Router);

  constructor() {}

  getSession() {
    return from(this.appwrite.account.getSession('current')).pipe(
      tap(response => {
        this.setSession(response);
        this.router.navigateByUrl('members')
      }),
      catchError(err => {
        return throwError(() => {
          return 'No Session';
        })
      })
    )
  }

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
    console.log('Set session:');
    console.log(session);
    this.loggedIn.set(session);
  }
}
