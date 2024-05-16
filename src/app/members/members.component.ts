import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";
import {Router} from "@angular/router";
import {GalleryLoadService} from "./Service/gallery-load.service";
import {BlobGalleryItemContainer} from "../core/common/blob-gallery-item-container";
import {ViewportScroller} from "@angular/common";
import {StateService} from "./Service/state.service";
import {Subscription} from "rxjs";
import {Rate} from "../core/common/rate";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit, OnDestroy {

  @ViewChild('membersSection') membersSection!: ElementRef<HTMLElement>;

  dataStore: DataStoreService = inject(DataStoreService);
  galleryLoadService = inject(GalleryLoadService);
  router: Router = inject(Router);

  viewportScroller = inject(ViewportScroller);
  stateService = inject(StateService);

  destroyObs!: Subscription;

  rates: Rate[] = [];

  // Todo: Updated nicht vollständig,nur wenn cards gelöscht/hinzugefügt wurden, aber keine details !
  ngOnInit(): void {

    if (this.dataStore.getRatesValue().length === 0) {
      this.dataStore.updateRates().subscribe();
    }else {
      this.dataStore.checkForNewRate();
    }

    this.manageScrollTo();
  }

  manageScrollTo() {
    this.destroyObs = this.dataStore.ratesOb$.subscribe(() => {

      // After adding new rates set scroll position to 0,0
      if (this.stateService.getPreviousUrl()?.includes('addRate') && !this.stateService.getPreviousUrl()?.includes('editRate')) {
        this.stateService.membersScrollYPosition.set([0,0]);
      }

      setTimeout(() => {
        this.viewportScroller.scrollToPosition(this.stateService.membersScrollYPosition());

        if (this.membersSection.nativeElement.classList.contains('show-grid')) {

        } else {
          this.membersSection.nativeElement.classList.toggle('show-grid');
        }

      },1);

    });
  }


  openRecipeDetail(id: string, images: BlobGalleryItemContainer[]) {
    this.router.navigateByUrl(`members/rateRecipe/${id}`);
    this.galleryLoadService.addActiveRateImages(images);
  }

  ngOnDestroy(): void {
    this.stateService.membersScrollYPosition.set(this.viewportScroller.getScrollPosition());
    this.destroyObs.unsubscribe();
  }


}
