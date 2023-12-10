import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {ID, Models, Storage} from "appwrite";
import {catchError, forkJoin, from, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  appwriteService: AppwriteService = inject(AppwriteService);
  storage!: Storage;

  imagesBucket: string = '6571b3d3847e479344fd';

  constructor() {
    this.storage = new Storage(this.appwriteService.client);
  }

  addImage(images: Blob[]) {

    const observables: Observable<Models.File | string>[] = images.map(image => {

      return from(this.storage.createFile(
        this.imagesBucket,
        ID.unique(),
        new File([image], image.size.toString())
      )).pipe(
        catchError(error => of(`Failed to create file: ${error}`))
      );

    })

    return forkJoin(observables);
  }

}
