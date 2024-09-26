import {Component, inject, Input} from '@angular/core';
import {Rate} from "../../../core/common/rate";
import {HelpersService} from "../../Service/helpers.service";

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {

  helperService = inject(HelpersService);

  @Input() rate!: Rate;

  ngOnInit(): void {
  }



}
