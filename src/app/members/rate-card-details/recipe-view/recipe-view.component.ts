import {Component, Input, OnInit} from '@angular/core';
import {Rate} from "../../../core/common/rate";

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent implements OnInit {

  @Input() rate!: Rate;

  ngOnInit(): void {
  }

}
