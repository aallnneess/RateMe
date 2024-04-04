import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Rate} from "../../core/common/rate";

@Component({
  selector: 'app-rate-card-details',
  templateUrl: './recipe-card-details.component.html',
  styleUrl: './recipe-card-details.component.css'
})
export class RecipeCardDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);

  book!: Rate;

  ngOnInit(): void {
    console.log(`Get Id: ${this.route.snapshot.paramMap.get('id')}`);
  }

  /*

  Bewertung abgeben:
  - Es kann nicht das ganze Buch einfach ersetzt werden, sondern es müssen die einzelnen properties direkt in der
    Datenbank geändert werden:

    - Rating: Rating wird hinzugefügt
    - Images: Werden dem BucketResponse hinzugefügt

   */

}
