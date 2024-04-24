import {Component, inject, Input, OnInit} from '@angular/core';
import {Rate} from "../../core/common/rate";
import {GalleryItem, ImageItem} from "ng-gallery";
import {FileService} from "../../core/Services/file.service";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {GalleryItemCustom} from "../../core/common/gallery-item-custom";

@Component({
  selector: 'app-rate-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RateCardComponent implements OnInit {

  fileService: FileService = inject(FileService);

  @Input( {required: true} ) rate!: Rate;

  images: BlobGalleryItemContainer[] = [];

  ngOnInit(): void {
    this.loadImage();
  }
  loadImage() {

    if (typeof this.rate.imageBuckets !== "string") {

      this.rate.imageBuckets.forEach(bucketResponse => {

        let newBlobGalleryItemContainer = new BlobGalleryItemContainer();
        newBlobGalleryItemContainer.bucketDocumentId = bucketResponse.$id;

        const tmpGalleryItemCustom: GalleryItemCustom = new ImageItem({
             src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
           }) as GalleryItemCustom;

        tmpGalleryItemCustom.bucketDocumentId = bucketResponse.$id;
        tmpGalleryItemCustom.userId = this.getUserId(bucketResponse.name)!;
        tmpGalleryItemCustom.userName = this.getUserName(bucketResponse.name)!;

        newBlobGalleryItemContainer.galleryItem = tmpGalleryItemCustom;

        this.images.push(newBlobGalleryItemContainer);
      });
    }

  }

  getAllGalleryItems() {
    const images: GalleryItem[] = [];
    for (let image of this.images) {
      images.push(image.galleryItem);
    }
    return images;
  }

  getUserId(imageName: string) {

    // Finden Sie die Position von "userId-" im String
    const userIdStartIndex = imageName.indexOf("userId-");
    if (userIdStartIndex === -1) {
      console.error("Substring 'userId-' nicht gefunden.");
      return;
    }

    // Finden Sie die Position von "-userName-" im String
    const userNameEndIndex = imageName.indexOf("-userName-", userIdStartIndex);
    if (userNameEndIndex === -1) {
      console.error("Substring '-userName-' nicht gefunden.");
      return;
    }

    // Extrahieren Sie den Substring zwischen den Positionen von "userId-" und "-userName-"
    return imageName.substring(userIdStartIndex + "userId-".length, userNameEndIndex);

  }

  getUserName(imageName: string) {

    // Finden Sie die Position von "-userName-" im String
    const userNameIndex = imageName.indexOf("-userName-");
    if (userNameIndex === -1) {
      console.error("Substring '-userName-' nicht gefunden.");
      return;
    }

    // Extrahieren Sie den Teil des Strings nach "-userName-"
    return imageName.substring(userNameIndex + "-userName-".length);
  }

}
