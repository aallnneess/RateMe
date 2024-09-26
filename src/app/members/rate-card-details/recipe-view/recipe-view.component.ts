import {Component, inject, Input, OnInit} from '@angular/core';
import {Rate} from "../../../core/common/rate";
import {HelpersService} from "../../Service/helpers.service";

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent implements OnInit {

  helperService = inject(HelpersService);

  @Input() rate!: Rate;

  ngOnInit(): void {
  }

}
