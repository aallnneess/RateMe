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

    console.log('All items: ');
    console.log(tmpItems);
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

  async searchForNewBlobsInsideBlobGalleryItemContainerArray(
    blobImages: Blob[],
    blobGalleryItemContainerArray: BlobGalleryItemContainer[]
  ) {

    const newImages: Blob[] = [];
    for (let image of blobImages) {

      let found = false;
      for (let blobGalleryItemContainer of blobGalleryItemContainerArray) {

        found = await this.compareBlobs(image, blobGalleryItemContainer.blob);

        if (found) {
          break;
        }
      }

      if (!found) {
        newImages.push(image);
      }

    }
    return newImages;
  }

  async searchForDeletedBlobsInBlobGalleryItemContainerArray(
    blobImages: Blob[],
    blobGalleryItemContainerArray: BlobGalleryItemContainer[]
  ) {
    const deletedImages: BlobGalleryItemContainer[] = [];

    for (let blobGalleryItemContainer of blobGalleryItemContainerArray) {
      let found = false;

      for (let image of blobImages) {
        found = await this.compareBlobs(image, blobGalleryItemContainer.blob);

        if (found) {
          break;
        }
      }

      if (!found) {
        deletedImages.push(blobGalleryItemContainer);
      }
    }

    return deletedImages;
  }

  // Funktion zum Vergleichen von zwei Blobs
  compareBlobs(blob1: Blob, blob2: Blob): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (blob1.size !== blob2.size) {
        // Wenn die Größe unterschiedlich ist, sind die Blobs definitiv verschieden
        resolve(false);
        return;
      }

      // Blobs in Arrays von Uint8-Zahlen konvertieren
      const reader1 = new FileReader();
      reader1.onload = () => {
        const array1 = new Uint8Array(reader1.result as ArrayBuffer);

        const reader2 = new FileReader();
        reader2.onload = () => {
          const array2 = new Uint8Array(reader2.result as ArrayBuffer);

          // Arrays von Uint8-Zahlen vergleichen
          for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
              // Wenn ein Unterschied gefunden wird, sind die Blobs verschieden
              resolve(false);
              return;
            }
          }

          // Wenn keine Unterschiede gefunden wurden, sind die Blobs gleich
          resolve(true);
        };
        reader2.onerror = reject;
        reader2.readAsArrayBuffer(blob2);
      };
      reader1.onerror = reject;
      reader1.readAsArrayBuffer(blob1);
    });
  }

}
