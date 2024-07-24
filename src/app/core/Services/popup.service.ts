import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FullScreenLoaderService} from "../../shared/services/full-screen-loader.service";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  errorMessage$ = new BehaviorSubject<string>('');
  fullScreenLoaderService = inject(FullScreenLoaderService);

  constructor() {
  }

  setErrorMessage(errorMessage: string) {
    // Wenn ein Fehler angezeigt wird, dürfte der DatenStream auch beendet sein
    this.fullScreenLoaderService.setLoadingOff();
    console.log('setErrorMessage: ' + errorMessage);
    this.errorMessage$.next(errorMessage);
  }
}
