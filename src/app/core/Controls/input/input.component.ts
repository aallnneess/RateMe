import {Component, EventEmitter, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {

  @Input() name!: string;
  @Input() value!: FormControl;
  @Input() type!: string;

  error!: string;

  checkErrors() {
    this.error = '';

    //console.log(this.value.errors);

    if (this.value.errors?.['required']) {
      this.error = 'Darf nicht fehlen.';
    }

    if (this.value.errors?.['minlength']) {
      this.error = 'Zu kurz.';
    }

    if (this.value.errors?.['pattern']) {
      this.error = 'Keine Sonderzeichen.';
    }

  }


}
