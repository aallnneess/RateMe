import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Rate} from "../../core/common/rate";
import {DataStoreService} from "../Service/data-store.service";

@Component({
  selector: 'app-rate-card-details',
  templateUrl: './rate-card-details.component.html',
  styleUrl: './rate-card-details.component.css'
})
export class RateCardDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  dataStore = inject(DataStoreService);

  rate!: Rate;

  ngOnInit(): void {
    this.rate = this.dataStore.getRate(this.route.snapshot.paramMap.get('id')!)!;
  }

  /*

  Bewertung abgeben:
  - Es kann nicht das ganze Buch einfach ersetzt werden, sondern es müssen die einzelnen properties direkt in der
    Datenbank geändert werden:

    - Rating: Rating wird hinzugefügt
    - Images: Werden dem BucketResponse hinzugefügt

   */

}
