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

    //console.log(this.recipe.imageBuckets);

    this.rate.imageBuckets.forEach(bucketResponse => {

      this.images.push(
        new ImageItem({
          src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
        })
      );
    });

  }

}
