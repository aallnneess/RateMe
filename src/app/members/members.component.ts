import {Component, inject, OnInit} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";
import {Router} from "@angular/router";
import {GalleryLoadService} from "./Service/gallery-load.service";
import {BlobGalleryItemContainer} from "../core/common/blob-gallery-item-container";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  dataStore: DataStoreService = inject(DataStoreService);
  galleryLoadService = inject(GalleryLoadService);
  router: Router = inject(Router);


  // Todo: Updated nicht vollständig,nur wenn  carsd gelöscht/hinzugefügt wurden, aber keine details !
  ngOnInit(): void {
    console.log('members init');
    if (this.dataStore.getRatesValue().length === 0) {
      this.dataStore.updateRates().subscribe();
    }else {
      this.dataStore.checkForNewRate();
    }

  }

  openRecipeDetail(id: string, images: BlobGalleryItemContainer[]) {
    this.router.navigateByUrl(`members/rateRecipe/${id}`, { skipLocationChange: true});
    this.galleryLoadService.addActiveRateImages(images);
  }
}
