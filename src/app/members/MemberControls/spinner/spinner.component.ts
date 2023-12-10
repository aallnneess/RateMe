import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-member-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  @Input() width: number = 48;
  @Input() height: number = 48;

  ngOnInit(): void {
    this.setLoaderSize();
  }

  setLoaderSize() {
    // document.documentElement.style.setProperty('--loader-width', `${this.width}px`);
    // document.documentElement.style.setProperty('--loader-height', `${this.height}px`);
  }

}
