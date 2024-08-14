import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {ImageGalleryComponent} from "./image-gallery/image-gallery.component";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {StateService, Status} from "../Service/state.service";
import {BlobCustom} from "../../core/common/blob-custom";
import {GalleryItemCustom} from "../../core/common/gallery-item-custom";
import {AuthService} from "../../core/Services/auth.service";
import {UserService} from "../../core/Services/user.service";

@Component({
  selector: 'app-image-cr',
  templateUrl: './image-cr.component.html',
  styleUrl: './image-cr.component.css'
})
export class ImageCrComponent implements OnInit {

  authService = inject(AuthService);
  userService = inject(UserService);
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
    // clean imagesNewOrEdit array
    this.galleryLoadService.imagesNewOrEdit.set([]);

    if (this.statesService.currentStatus() === Status.Edit) {
      this.loadEditImages();
    }
  }

  async loadEditImages() {

    for (let blobGalleryItemContainer of this.galleryLoadService.activeRateImages.value) {

      const blob: BlobCustom = blobGalleryItemContainer.blob as BlobCustom;
      blob.bucketDocumentId = blobGalleryItemContainer.bucketDocumentId;

      const tmpCustomGalleryItem: GalleryItemCustom = blobGalleryItemContainer.galleryItem as GalleryItemCustom;
      blob.userId = tmpCustomGalleryItem.userId;
      blob.username = tmpCustomGalleryItem.userName;

      switch (this.statesService.currentStatus()) {

        case Status.Idle:
          this.blobs.push(blob);
          break;

        case Status.Edit:
          if (blob.userId === this.userService.user()?.$id) {
            this.blobs.push(blob);
          }
          break;

      }


    }

    //console.log('Alle blobs geladen.');
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
    console.log(this.blobs);
    this.blobs.splice(stateId,1);
    this.galleryLoadService.addBlobImages(this.blobs);
     console.log('state: ' + stateId);
     console.log(this.blobs);
  }


}
