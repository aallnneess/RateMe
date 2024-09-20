import {computed, inject, Injectable, signal} from '@angular/core';
import {Models} from "appwrite";
import {AppwriteService} from "./appwrite.service";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appwriteService = inject(AppwriteService);
  router = inject(Router);

  #sessionSignal = signal<Models.Session | null | undefined>(undefined);
  session = this.#sessionSignal.asReadonly();

  loggedIn = computed(() => !!this.session());

  async lookForSession(): Promise<Models.Session> {
    console.log('authService lookForSession');
    const session = await this.appwriteService.account.getSession('current');
    if (!session) this.#sessionSignal.set(session);
    this.#sessionSignal.set(session);
    return session;
  }

  async login(email: string, password: string): Promise<Models.Session | null> {
    const session = await this.appwriteService.account.createEmailPasswordSession(
      email,
      password
    );
    this.#sessionSignal.set(session);
    return session;
  }

  async logout(): Promise<void> {
    const result = await this.appwriteService.account.deleteSession(this.session()!.$id);
    this.#sessionSignal.set(null);
    this.router.navigate(['/']);
  }

}
