import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {ImageGalleryComponent} from "./image-gallery/image-gallery.component";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {StateService, Status} from "../Service/state.service";

@Component({
  selector: 'app-image-cr',
  templateUrl: './image-cr.component.html',
  styleUrl: './image-cr.component.css'
})
export class ImageCrComponent implements OnInit {

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  statesService = inject(StateService);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('gallery') gallery!: ImageGalleryComponent;

  blobs: Blob[] = [];


  @Input() width = 1280;
  @Input() height = 720;
  onlyScaleDown = true;

  showCropper = true;
  showLoader = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob!: Blob | null;

  ngOnInit(): void {
    if (this.statesService.currentStatus() === Status.Edit) {
      this.loadEditImages();
    }
  }

  async loadEditImages() {
    const activeImages = this.galleryLoadService.activeRateImages();

    for (let activeImage of activeImages) {
      if (typeof activeImage.data?.src === 'string') {
        try {
          const blop = await this.urlToBlob(activeImage.data.src);
          this.blobs.push(blop);
        } catch (e) {
          console.error(e);
        }
      }
    }

    console.log('Alle blobs geladen.');
    this.galleryLoadService.addBlobImages(this.blobs);
    this.showCropper = false;
  }

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
    this.showLoader = true;
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
    this.showLoader = false;

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  removeItem(stateId: number) {
    this.blobs.splice(stateId,1);
    this.galleryLoadService.addBlobImages(this.blobs);
     // console.log('state: ' + stateId);
     // console.log(this.blobs);
  }

  async urlToBlob(url: string) {
    const response = await fetch(url);
    return await response.blob();
  }

  protected readonly Status = Status;


}
