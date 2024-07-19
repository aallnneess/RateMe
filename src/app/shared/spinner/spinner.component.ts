import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  @Input() width: number = 48;
  @Input() height: number = 48;

}
