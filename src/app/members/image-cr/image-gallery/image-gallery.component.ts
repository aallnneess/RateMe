import {
  AfterViewChecked,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {GalleryComponent, GalleryItem, GalleryState} from "ng-gallery";
import {GalleryLoadService} from "../../Service/gallery-load.service";
import {Subject, takeUntil} from "rxjs";
import {Lightbox} from "ng-gallery/lightbox";

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

  items: GalleryItem[] = [];
  state!: GalleryState;

  ngOnInit(): void {
    this.items = this.galleryLoadService.imagesGallery();
    // console.log('Income Array: ');
    // console.log(this.items);
  }

  removeItem() {
    //console.log('remove with state: ' + this.state.currIndex);
    this.remove.emit(this.state.currIndex!);
    this.gallery.remove(this.state.currIndex!);
  }

  ngAfterViewChecked(): void {
    this.gallery.galleryRef.state.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      if (this.state !== state) {
        this.state = state;
        //console.log(this.state);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
  }
}
