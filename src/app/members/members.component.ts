import {Component, inject, OnInit} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";
import {Router} from "@angular/router";
import {GalleryLoadService} from "./Service/gallery-load.service";
import {GalleryItem} from "ng-gallery";
import {DatabaseService} from "../core/Services/database.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  dataStore: DataStoreService = inject(DataStoreService);
  galleryLoadService = inject(GalleryLoadService);
  router: Router = inject(Router);


  ngOnInit(): void {
    if (this.dataStore.rates.value.length === 0) {
      this.dataStore.updateRates().subscribe();
    }else {
      this.dataStore.checkForNewRate();
    }
  }

  openRecipeDetail(id: string, images: GalleryItem[]) {
    this.router.navigateByUrl(`members/rateRecipe/${id}`, { skipLocationChange: true});
    this.galleryLoadService.addActiveRateImages(images);
  }
}
