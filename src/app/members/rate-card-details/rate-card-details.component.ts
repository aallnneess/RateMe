import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Rate} from "../../core/common/rate";
import {DataStoreService} from "../Service/data-store.service";
import {GalleryItem} from "ng-gallery";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {DatabaseService} from "../../core/Services/database.service";
import {AuthService} from "../../core/Services/auth.service";

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
  dataBaseService = inject(DatabaseService);
  authService = inject(AuthService);

  @ViewChild('galleryDiv') galleryDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('galleryDivAbsolut') galleryDivAbsolut!: ElementRef<HTMLDivElement>;

  rate!: Rate;
  images: GalleryItem[] = [];

  showAddChildButton = false;

  ngOnInit(): void {
    this.rate = this.dataStore.getRate(this.route.snapshot.paramMap.get('id')!)!;
    this.images = this.galleryLoadService.getAllGalleryItems(this.galleryLoadService.activeRateImages());

    this.showAddChildRate();
  }


  galleryToggle() {
    this.galleryDiv.nativeElement.classList.toggle('display-controller');
    this.galleryDivAbsolut.nativeElement.classList.toggle('display-controller');

    console.log(this.galleryDiv.nativeElement.classList);
  }

  addChildRate() {
    this.router.navigate(['members/addRate', 'recipe', {rate: JSON.stringify(this.rate)}], {skipLocationChange: true});
  }

  showAddChildRate() {
    this.dataBaseService.checkIfUserHasRated(this.authService.user()!.$id,this.rate.notesCollectionId).subscribe(result => {
      if (result.total === 0) {
        this.showAddChildButton = true;
      }
    });
  }

  editRate() {
    this.router.navigate(['members/addRate', 'recipe', {editRate: JSON.stringify(this.rate)}], {skipLocationChange: true});
  }
}

