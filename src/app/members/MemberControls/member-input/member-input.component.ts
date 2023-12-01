import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-member-input',
  templateUrl: './member-input.component.html',
  styleUrl: './member-input.component.css'
})
export class MemberInputComponent {

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('label') label!: ElementRef<HTMLLabelElement>;

  @Input() name!: string;
  @Input() value!: FormControl;
  @Input() type!: string;

  @Input() textarea = false;

  @Input() slider = false;

  error!: string;

  focusOut() {

    console.log(this.input);

    if (this.input.nativeElement.value.length === 0) {
      this.label.nativeElement.classList.remove('floating-label-small')
    }

  }

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
