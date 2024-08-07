import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {catchError, concatMap, from, Observable, tap, throwError} from "rxjs";
import {ID, Models} from "appwrite";
import {Router} from "@angular/router";
import {NodeServerService} from "./node-server.service";
import {UserInfo} from "../common/user-info";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: WritableSignal<Models.Session|null> = signal(null);
  user: WritableSignal<UserInfo|null> = signal(null);

  appwrite = inject(AppwriteService);
  router = inject(Router);
  nodeServer = inject(NodeServerService);

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
    return from(this.appwrite.account.createEmailPasswordSession(
      email,
      password
    )).pipe(
      tap(response => {
        this.loggedIn.set(response);
      }),
      concatMap(() => this.setUser()),
      catchError(err => {

        // Ist eine session vorhanden, soll diese genutzt werden
        if (err === 'Creation of a session is prohibited when a session is active.') {
          return this.getSession();
        }

        return throwError(() => {
          return err.message
        })
      })
    );
  }

  setSession(session: Models.Session) {
    //console.log('Set session:');
    this.loggedIn.set(session);

    if (this.loggedIn()) {
      this.nodeServer.getUserWithId(this.loggedIn()?.userId!).subscribe(user => {
        this.user.set(user);
      });
    }
  }

  setUser() {
    return from(this.nodeServer.getUserWithId(this.loggedIn()?.userId!)).pipe(
      tap(user => {
        this.user.set(user);
        console.log('setUser');
      })
    );
  }
}
