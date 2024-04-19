import {Component, inject, Input, OnInit} from '@angular/core';
import {Rate} from "../../core/common/rate";
import {GalleryItem, ImageItem} from "ng-gallery";
import {FileService} from "../../core/Services/file.service";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";

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

        let newImage = new BlobGalleryItemContainer();
        newImage.bucketDocumentId = bucketResponse.$id;
        newImage.galleryItem = new ImageItem({
          src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
        });

        this.images.push(newImage);

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

}
