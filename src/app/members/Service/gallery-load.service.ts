import {Injectable, signal, WritableSignal} from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";

@Injectable({
  providedIn: 'root'
})
export class GalleryLoadService {

  // Used by ImageGalleryComponent in Recipe-Card-Details & ImageCrComponent
  imagesCardGallery: WritableSignal<GalleryItem[]> = signal([]);
  // Used in AddRateComponent for new or Edit Rates
  imagesNewOrEdit: WritableSignal<Blob[]> = signal([]);

  // If user clicks a rate card and open rate details, here will be saved the card-images
  activeRateImages: WritableSignal<BlobGalleryItemContainer[]> = signal([]);

  addBlobImages(blobs: Blob[]) {
    this.imagesNewOrEdit.set(blobs);
    this.addGalleryItems(blobs);
  }

  addActiveRateImages(images: BlobGalleryItemContainer[]) {
    this.activeRateImages.set(images);
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

    this.imagesCardGallery.set(tmpItems);
  }

  getAllGalleryItems(blobItemGalleryItems: BlobGalleryItemContainer[]) {
    const images: GalleryItem[] = [];
    for (let image of blobItemGalleryItems) {
      images.push(image.galleryItem);
    }
    return images;
  }

}
