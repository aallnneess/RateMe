import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";

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

  @ViewChild('input') input!: ElementRef<HTMLInputElement>

  @Output('Image') images = new EventEmitter<Blob[]>();
  blobs: Blob[] = [];

  @Input() width = 1280;
  @Input() height = 720;
  onlyScaleDown = true;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  clear() {
    this.imageChangedEvent  = '';
    this.croppedImage = '';
    this.input.nativeElement.value = '';
    this.blobs = [];
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.blobs.push(event.blob as Blob);
    this.images.emit(this.blobs);

    console.log('Größe des Bildes in KB: ' + event.blob!.size / 1024);

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
