import {AfterViewChecked, Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {GalleryComponent, GalleryItem, GalleryState} from "ng-gallery";
import {GalleryLoadService} from "../../Service/gallery-load.service";
import {Subject, takeUntil} from "rxjs";
import {AuthService} from "../../../core/Services/auth.service";
import {StateService, Status} from "../../Service/state.service";

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Output() remove = new EventEmitter<number>();

  @ViewChild(GalleryComponent) gallery!: GalleryComponent;
  private destroy$ = new Subject();

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  authService: AuthService = inject(AuthService);
  statesService = inject(StateService);

  items: GalleryItem[] = [];
  state!: GalleryState;

  imageIndex = 0;

  ngOnInit(): void {

    this.items = this.galleryLoadService.imagesCardGallery();

    // console.log('Gallery Loaded');
    // console.log(this.items);
  }

  removeItem() {
    console.log(this.items);
    console.log('state ' + this.state.currIndex);
    this.remove.emit(this.state.currIndex!);
    this.gallery.remove(this.state.currIndex!);
  }

  ngAfterViewChecked(): void {
    this.gallery.galleryRef.state.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      if (this.state !== state) {
        this.state = state;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
  }

  haveUserUploadThisImage() {
    if (this.statesService.currentStatus() === Status.Edit) {

      if (this.items[this.imageIndex].data && this.items[this.imageIndex].data!.args && this.items[this.imageIndex].data!.args['userId']) {
        return this.authService.user()?.$id! === this.items[this.imageIndex]!.data!.args['userId'];
      }
    }

    return true;
  }

  indexChange(event: GalleryState) {
    if (event) {
      this.imageIndex = event.currIndex!;
      console.log('set index: ' + this.imageIndex);
    }
  }
}
