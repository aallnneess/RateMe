import {inject, Injectable} from '@angular/core';
import {AppwriteService} from "./appwrite.service";
import {ID, Models, Storage} from "appwrite";
import {catchError, forkJoin, from, Observable, of} from "rxjs";
import {AuthService} from "./auth.service";
import {BlobGalleryItemContainer} from "../common/blob-gallery-item-container";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  appwriteService: AppwriteService = inject(AppwriteService);
  authService = inject(AuthService);
  userService = inject(UserService);
  storage!: Storage;

  imagesBucket: string = '6571b3d3847e479344fd';

  constructor() {
    this.storage = new Storage(this.appwriteService.client);
  }

  addImage(images: Blob[]) {

    if (images.length === 0) {
      return of([]); // Rückgabe eines Observables mit einem leeren Array
    }

    const fileName = 'userId-' + this.userService.user()?.$id + '-userName-' + this.userService.user()?.name;

    const observables: Observable<Models.File | string>[] = images.map(image => {

      return from(this.storage.createFile(
        this.imagesBucket,
        ID.unique(),
        new File([image], fileName)
      )).pipe(
        catchError(error => of(`Failed to create file: ${error}`))
      );

    });

    return forkJoin(observables);
  }

  getFileforView(bucketId: string, fileId: string) {
    return this.storage.getFileView(bucketId, fileId);
  }

  removeImage(blobGalleryItemContainers: BlobGalleryItemContainer[]) {

    if (blobGalleryItemContainers.length === 0) {
      return of([]);
    }

    const observables = blobGalleryItemContainers.map(blobGItem => {

      return from(this.storage.deleteFile(
        this.imagesBucket,
        blobGItem.bucketDocumentId
      )).pipe(
        catchError(error => of(`Failed to delete file: ${error}`))
      )
    });

    return forkJoin(observables);
  }

}
