import {Component, inject, Input, OnInit} from '@angular/core';
import {Rate} from "../../core/common/rate";
import {GalleryItem, ImageItem} from "ng-gallery";
import {FileService} from "../../core/Services/file.service";

@Component({
  selector: 'app-rate-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RateCardComponent implements OnInit {

  fileService: FileService = inject(FileService);

  @Input( {required: true} ) rate!: Rate;

  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadImage();
  }
  loadImage() {

    if (typeof this.rate.imageBuckets !== "string") {

      console.log('Menge imagebuckets: ' + this.rate.imageBuckets.length);

      this.rate.imageBuckets.forEach(bucketResponse => {

        this.images.push(
          new ImageItem({
            src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
          })
        );
      });
    }

    console.log('bilder menge: ' + this.images.length);

  }

}
