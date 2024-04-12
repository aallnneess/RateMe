import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Rate} from "../../core/common/rate";
import {DataStoreService} from "../Service/data-store.service";
import {GalleryItem} from "ng-gallery";
import {GalleryLoadService} from "../Service/gallery-load.service";

@Component({
  selector: 'app-rate-card-details',
  templateUrl: './rate-card-details.component.html',
  styleUrl: './rate-card-details.component.css'
})
export class RateCardDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  dataStore = inject(DataStoreService);
  galleryLoadService = inject(GalleryLoadService);

  @ViewChild('galleryDiv') galleryDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('galleryDivAbsolut') galleryDivAbsolut!: ElementRef<HTMLDivElement>;

  rate!: Rate;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.rate = this.dataStore.getRate(this.route.snapshot.paramMap.get('id')!)!;
    this.images = this.galleryLoadService.activeRateImages();
  }


  galleryToggle() {
    this.galleryDiv.nativeElement.classList.toggle('display-controller');
    this.galleryDivAbsolut.nativeElement.classList.toggle('display-controller');

    console.log(this.galleryDiv.nativeElement.classList);
  }

  addChildRate() {
    this.router.navigate(['members/addRate', 'recipe', {rate: JSON.stringify(this.rate)}]);
  }
}

