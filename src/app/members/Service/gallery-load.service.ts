import {Injectable, signal, WritableSignal} from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GalleryLoadService {

  // Used by ImageGalleryComponent in Recipe-Card-Details & ImageCrComponent
  imagesCardGallery: WritableSignal<GalleryItem[]> = signal([]);
  // Used in AddRateComponent for new or Edit Rates
  imagesNewOrEdit: WritableSignal<Blob[]> = signal([]);

  // If user clicks a rate card and open rate details, here will be saved the card-images
  activeRateImages = new BehaviorSubject<BlobGalleryItemContainer[]>([]);

  addBlobImages(blobs: Blob[]) {
    this.imagesNewOrEdit.set(blobs);
    this.addGalleryItemsFromBlobArray(blobs);
  }

  addActiveRateImages(images: BlobGalleryItemContainer[]) {
    this.activeRateImages.next([]);
    this.addBlobToBlobGalleryItemsContainerArray(images).then(result => {
      this.activeRateImages.next(images);
    });
  }

  addGalleryItemsFromBlobArray(items: Blob[]) {
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

    this.imagesCardGallery.set(tmpItems);
  }

  getAllGalleryItemsFromBlobGalleryItemsArray(blobItemGalleryItems: BlobGalleryItemContainer[]) {
    const images: GalleryItem[] = [];
    for (let image of blobItemGalleryItems) {
      images.push(image.galleryItem);
    }
    return images;
  }

  async addBlobToBlobGalleryItemsContainerArray(items: BlobGalleryItemContainer[]) {
    for (let item of items) {
      if (typeof item.galleryItem.data?.src === 'string') {
        try {
          item.blob = await this.urlToBlob(item.galleryItem.data?.src);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return items;
  }

  async urlToBlob(url: string) {
    const response = await fetch(url);
    return await response.blob();
  }

}
