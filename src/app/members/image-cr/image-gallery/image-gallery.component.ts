import {Component, inject, OnInit} from '@angular/core';
import {GalleryItem, ImageItem} from "ng-gallery";
import {GalleryLoadService} from "../../Service/gallery-load.service";

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent implements OnInit {

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);

  items: GalleryItem[] = [];

  ngOnInit(): void {
    this.items = this.galleryLoadService.imagesGallery();
  }

}
