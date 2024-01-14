import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import KeenSlider, {KeenSliderInstance} from "keen-slider";
import {GalleryItem} from "ng-gallery";

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


  ngAfterViewInit() {
    //this.slider = new KeenSlider(this.sliderRef.nativeElement);

    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slideChanged: (s) => {
          this.updatedImageIndex = s.track.details.rel;
      }
    });
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



  /**
   * Handles the touch move event.
   *
   * @param {TouchEvent} event - The touch event object.
   */
  // handleTouchMove(event: TouchEvent) {
  //
  //   if (event.touches.length === 2) {
  //     const touch1 = event.touches[0];
  //     const touch2 = event.touches[1];
  //     const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  //
  //     if (this.initialDistance) {
  //       const scaleChange = currentDistance / this.initialDistance;
  //       this.scale = scaleChange; // Now this respects the initial distance
  //       this.updateZoom();
  //     }
  //   }
  // }

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
    //this.zoomImage.nativeElement.style.transform = `scale(${this.scale})`;
  }



  resetZoom() {
    this.initialDistance = null; // Reset the initial distance
    this.scale = 1;
    this.updateZoom();
  }

}
