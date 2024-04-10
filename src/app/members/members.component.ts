import {Component, inject, OnInit} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";
import {Router} from "@angular/router";
import {GalleryLoadService} from "./Service/gallery-load.service";
import {GalleryItem} from "ng-gallery";

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
    this.dataStore.updateRates();
  }

  openRecipeDetail(id: string, images: GalleryItem[]) {
    this.router.navigateByUrl(`members/rateRecipe/${id}`, { skipLocationChange: true});
    this.galleryLoadService.addActiveRateImages(images);
  }
}
