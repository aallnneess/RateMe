import {AfterViewInit, Component, ElementRef, Input, OnDestroy, signal, ViewChild} from '@angular/core';
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import {GalleryItem} from "ng-gallery";

@Component({
  selector: 'app-keen-sl',
  templateUrl: './keen-sl.component.html',
  styleUrls: ['../../../../../node_modules/keen-slider/keen-slider.min.css', './keen-sl.component.css']
})
export class KeenSLComponent implements AfterViewInit, OnDestroy {

  @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>;

  @Input({ required: true }) items: GalleryItem[] = [];

  slider!: KeenSliderInstance;



  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement)
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }

}
