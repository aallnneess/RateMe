import {
  AfterViewInit,
  Component,
  ElementRef, inject,
  Input,
  OnDestroy,
  QueryList, signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import KeenSlider, {KeenSliderInstance} from "keen-slider";
import {GalleryItem} from "ng-gallery";
import {GalleryItemCustom} from "../../../core/common/gallery-item-custom";
import {HelpersService} from "../../Service/helpers.service";

@Component({
  selector: 'app-keen-sl',
  templateUrl: './keen-sl.component.html',
  styleUrls: ['../../../../../node_modules/keen-slider/keen-slider.min.css', './keen-sl.component.css']
})
export class KeenSLComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('zoomImage') zoomImages!: QueryList<ElementRef<HTMLImageElement>>;
  scale = 1;
  updatedImageIndex = 0;
  initialDistance: number | null = null;

  @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>;

  @Input({ required: true }) items: GalleryItem[] = [];

  slider!: KeenSliderInstance;

  helperService = inject(HelpersService);
  currentImageUserName = signal<string>('');
  currentImageUpdatedAt = signal<string>('');


  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slideChanged: (s) => {
          this.updatedImageIndex = s.track.details.rel;
          this.updateNameAndUpdatedAt();
      }
    });
    this.updateNameAndUpdatedAt();
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy();
  }

  // #################################################################################

  handleTouchStart(event: TouchEvent) {

    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      this.initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
  }


  handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

      if (this.initialDistance) {
        const scaleChange = currentDistance / this.initialDistance;
        // Aktualisiere das Zoom-Niveau nur, wenn es größer als das aktuelle ist
        if (scaleChange >= 1) {
          this.scale = scaleChange;
          this.updateZoom();
        }
      }
    }
  }


  /**
   * Updates the zoom of the image.
   *
   * @param {type} - No parameters.
   * @return {void} - No return value.
   */
  updateZoom() {
    this.zoomImages.get(this.updatedImageIndex)!.nativeElement.style.transform = `scale(${this.scale})`;
  }



  resetZoom() {
    this.initialDistance = null; // Reset the initial distance
    this.scale = 1;
    this.updateZoom();
  }

  updateNameAndUpdatedAt() {
    this.currentImageUserName.set((this.items[this.updatedImageIndex] as unknown as GalleryItemCustom).userName);
    this.currentImageUpdatedAt.set(this.helperService.formatDateToGermanDate(
      (this.items[0] as unknown as GalleryItemCustom).updatedAt
    ));
  }

}
