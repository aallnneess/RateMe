import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Rate} from "../../core/common/rate";
import {DataStoreService} from "../Service/data-store.service";
import {GalleryItem} from "ng-gallery";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {AuthService} from "../../core/Services/auth.service";
import {Subject, takeUntil} from "rxjs";
import {DatabaseService} from "../Service/database.service";
import {AppwriteService} from "../../core/Services/appwrite.service";
import {ID} from "appwrite";


@Component({
  selector: 'app-rate-card-details',
  templateUrl: './rate-card-details.component.html',
  styleUrl: './rate-card-details.component.css'
})
export class RateCardDetailsComponent implements OnInit, OnDestroy {
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
  showAddChildButtonChecked = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  appwriteService = inject(AppwriteService);

  constructor() {

    window.addEventListener('popstate', () => {

      this.appwriteService.databases.createDocument(
        '66b4abb3003643a78720',
        '66b4abcc0019de1c1653',
        ID.unique(),
        {
          href: location.href
        }
      );

    });

  }

  ngOnInit(): void {
    this.rate = this.dataStore.getRate(this.route.snapshot.paramMap.get('id')!)!;

    this.galleryLoadService.activeRateImages.pipe(
      takeUntil(this.destroy$)
    ).subscribe(images => {
      this.images = this.galleryLoadService.getAllGalleryItemsFromBlobGalleryItemsArray(images);
    });

    this.showAddChildRate();
  }


  galleryToggle() {
    this.galleryDiv.nativeElement.classList.toggle('display-controller');
    this.galleryDivAbsolut.nativeElement.classList.toggle('display-controller');

    console.log(this.galleryDiv.nativeElement.classList);
  }

  addChildRate() {
    this.router.navigate(['members/addRate', this.rate.rateTopic]);
    this.dataStore.setParentRate(this.rate);
  }

  showAddChildRate() {
    this.dataBaseService.checkIfUserHasRated(this.authService.user()!.$id,this.rate.notesCollectionId).subscribe(result => {
      if (result.total === 0) {
        this.showAddChildButton = true;
      }
      this.showAddChildButtonChecked = true;
    });
  }

  editRate() {

    if (this.rate.userId !== this.authService.user()!.$id) {

      // We need everytime the latest image
      this.dataBaseService.getRateByUserIdAndParentDocumentId(
        this.authService.user()!.$id,
        this.rate.$id
      ).subscribe(result => {
        if (result) {
          this.dataStore.setEditRate(result);
          this.router.navigate(['members/addRate', this.rate.rateTopic]);
        }
      });

    } else {

      // We need everytime the latest image
      this.dataBaseService.getRateById(this.rate.$id).subscribe(result => {
        this.dataStore.setEditRate(result);
        this.router.navigate(['members/addRate', this.rate.rateTopic]);
      });


      // this.router.navigate(['members/addRate', this.rate.rateTopic]);
      // this.dataStore.setEditRate(this.rate);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.appwriteService.databases.createDocument(
      '66b4abb3003643a78720',
      '66b4abcc0019de1c1653',
      ID.unique(),
      {
        href: location.href,
        destroy: 'true'
      }
    );
  }

}

