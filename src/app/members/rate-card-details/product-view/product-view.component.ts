import {Component, Input} from '@angular/core';
import {Rate} from "../../../core/common/rate";

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {

  @Input() rate!: Rate;

  ngOnInit(): void {
  }

}
