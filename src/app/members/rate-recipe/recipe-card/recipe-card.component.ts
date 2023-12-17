import {Component, inject, Input, OnInit} from '@angular/core';
import {RateBook} from "../../../core/common/rate-book";
import {GalleryItem, ImageItem} from "ng-gallery";
import {FileService} from "../../../core/Services/file.service";
import {GalleryLoadService} from "../../Service/gallery-load.service";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent implements OnInit {

  galleryId!: number;

  fileService: FileService = inject(FileService);
  galleryService: GalleryLoadService = inject(GalleryLoadService);

  @Input( {required: true} ) recipe!: RateBook;

  items: GalleryItem[] = [];
  tags = '';

  ngOnInit(): void {
    this.loadImage();
    this.galleryId = this.galleryService.getGalleryId();
  }

  random() {
    return this.galleryId.toString();
  }

  loadImage() {

    //console.log(this.recipe.imageBuckets);

    this.recipe.imageBuckets.forEach(bucketResponse => {

      this.items.push(
        new ImageItem({
          src: this.fileService.getFileforView(bucketResponse.bucketId, bucketResponse.$id).toString()
        })
      );
    });

  }



}
