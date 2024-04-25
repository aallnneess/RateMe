import {Injectable, signal, WritableSignal} from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {BehaviorSubject} from "rxjs";
import {BlobCustom} from "../../core/common/blob-custom";

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

  // Used by Image-Cr - Add/Load/Remove Item
  addBlobImages(blobs: Blob[]) {
    this.imagesNewOrEdit.set(blobs);
    this.addGalleryItemsFromBlobArray(blobs);
  }

  // used by Member Component Component - with images from rate-card
  addActiveRateImages(images: BlobGalleryItemContainer[]) {
    this.activeRateImages.next([]);
    this.addBlobToBlobGalleryItemsContainerArray(images).then(result => {
      this.activeRateImages.next(images);
    });
  }

  addGalleryItemsFromBlobArray(items: Blob[]) {
    let tmpItems: GalleryItem[] = [];

    items.forEach(item => {
      //console.log('convert');

      let customItem: BlobCustom = item as BlobCustom;

      if (this.activeRateImages.value.find(image => image.bucketDocumentId === customItem.bucketDocumentId)) {

        tmpItems.push(
          new ImageItem({
            src: URL.createObjectURL(item),
            args: {
              bucketDocumentId: customItem.bucketDocumentId,
              userId: customItem.userId,
              userName: customItem.username
            }
          })
        );

      } else {
        tmpItems.push(
          new ImageItem({
            src: URL.createObjectURL(item)
          })
        );
      }


    });

    //console.log('All items: ');
    //console.log(tmpItems);
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
