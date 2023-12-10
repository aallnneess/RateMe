import {Injectable, signal, WritableSignal} from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";

@Injectable({
  providedIn: 'root'
})
export class GalleryLoadService {

  imagesGallery: WritableSignal<GalleryItem[]> = signal([]);
  images: WritableSignal<Blob[]> = signal([]);


  addBlobImages(blobs: Blob[]) {
    console.log('addBlobImages');
    this.images.set(blobs);
    console.log(this.images());

    this.addGalleryItems(blobs);
  }

  addGalleryItems(items: Blob[]) {
    // TODO: Checken ob blob als GalleryItem bereits vorhanden ist, und nur wenn nicht hinzufügen

    let tmpItems: GalleryItem[] = [];

    items.forEach(item => {
      //console.log('convert');
      tmpItems.push(
        new ImageItem({
          src: URL.createObjectURL(item)
        })
      );
    });

    this.imagesGallery.set(tmpItems);
  }

}
