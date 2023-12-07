import {Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild} from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {ImageGalleryComponent} from "./image-gallery/image-gallery.component";
import {GalleryLoadService} from "../Service/gallery-load.service";

/*

-> uploadedImage!: Blob;

setCroppedImage(blob: Blob) {
  this.uploadedImage = blob;
}

*/


@Component({
  selector: 'app-image-cr',
  templateUrl: './image-cr.component.html',
  styleUrl: './image-cr.component.css'
})
export class ImageCrComponent {

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('gallery') gallery!: ImageGalleryComponent;

  @Output('Image') images = new EventEmitter<Blob[]>();
  blobs: Blob[] = [];


  @Input() width = 1280;
  @Input() height = 720;
  onlyScaleDown = true;

  showCropper = true;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob!: Blob | null;


  add() {
    if (this.croppedImageBlob) {
      this.blobs.push(this.croppedImageBlob);
      this.galleryLoadService.addBlobImages(this.blobs);
    }

    this.imageChangedEvent  = '';
    this.croppedImage = '';
    this.input.nativeElement.value = '';
    this.croppedImageBlob = null;

    this.showCropper = false;
  }

  imageSelect() {
    this.showCropper = true;
  }



  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.croppedImageBlob = event.blob as Blob;

    //console.log('Größe des Bildes in KB: ' + event.blob!.size / 1024);

    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
