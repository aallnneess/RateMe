import {Component, inject, Input, OnInit} from '@angular/core';
import {HelpersService} from "../../Service/helpers.service";
import {Rate} from "../../../core/common/rate";

@Component({
  selector: 'app-foodtruck-view',
  templateUrl: './foodtruck-view.component.html',
  styleUrl: './foodtruck-view.component.css'
})
export class FoodtruckViewComponent implements OnInit {

  helperService = inject(HelpersService);

  @Input() rate!: Rate;

  ngOnInit(): void {
  }

}
