import {Component, inject, Input, OnInit} from '@angular/core';
import {Rate} from "../../core/common/rate";
import {GalleryItem, ImageItem} from "ng-gallery";
import {FileService} from "../../core/Services/file.service";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {GalleryItemCustom} from "../../core/common/gallery-item-custom";
import {HelpersService} from "../Service/helpers.service";

@Component({
  selector: 'app-rate-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RateCardComponent implements OnInit {

  helperService = inject(HelpersService);
  fileService: FileService = inject(FileService);

  @Input( {required: true} ) rate!: Rate;

  images: BlobGalleryItemContainer[] = [];

  ngOnInit(): void {
    this.loadImage();
  }
  loadImage() {

    if (typeof this.rate.imageBucketsGlobal !== "string") {

      this.rate.imageBucketsGlobal.forEach(bucketResponse => {

        let newBlobGalleryItemContainer = new BlobGalleryItemContainer();
        newBlobGalleryItemContainer.bucketDocumentId = bucketResponse.$id;

        const tmpGalleryItemCustom: GalleryItemCustom = new ImageItem({
             src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
           }) as GalleryItemCustom;

        tmpGalleryItemCustom.bucketDocumentId = bucketResponse.$id;
        tmpGalleryItemCustom.userId = this.getUserId(bucketResponse.name)!;
        tmpGalleryItemCustom.userName = this.getUserName(bucketResponse.name)!;
        tmpGalleryItemCustom.updatedAt = bucketResponse.$updatedAt;

        newBlobGalleryItemContainer.galleryItem = tmpGalleryItemCustom;

        this.images.push(newBlobGalleryItemContainer);
      });
    }

  }


  // TODO: Nur Foodtruck Bilder werden von Neu -> Alt sortiert !
  getAllGalleryItems(): GalleryItem[] {

    if (this.rate.rateTopic !== 'foodtruck') {
      let images: GalleryItem[] = [];
      for (let image of this.images) {
        images.push(image.galleryItem);
      }

      images = images.sort((a: any, b: any) => a.updatedAt - b.updatedAt);

      return images;
    }


    return this.images
      .map(image => image.galleryItem)
      .sort((a, b) => {
        // Temporärer Cast auf `any` oder ein erweitertes Interface
        const updatedAtA = (a as any).updatedAt;
        const updatedAtB = (b as any).updatedAt;

        // Sortieren nach `updatedAt`, falls vorhanden
        // return(updatedAtB ?? 0) - (updatedAtA ?? 0);
        return (new Date(updatedAtB).getTime() ?? 0) - (new Date(updatedAtA).getTime() ?? 0);
      });
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
