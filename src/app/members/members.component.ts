import {Component, inject, OnInit} from '@angular/core';
import {DataStoreService} from "./Service/data-store.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  dataStore: DataStoreService = inject(DataStoreService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.dataStore.updateRates();
  }

  click() {
    console.log('klick');
  }

  openRecipeDetail(id: string) {
    this.router.navigateByUrl(`members/rateRecipe/${id}`, {skipLocationChange: true});
  }
}
