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
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('label2') label2!: ElementRef<HTMLLabelElement>;


  @Input({ required: true }) value!: FormControl;
  @Input({ required: true }) labelInputId!: string;

  // Nur für Text-Input
  @Input() textFieldType!: string;

  // Nur für Textarea
  @Input() textarea = false;

  // Nur für tags
  @Input() tags = false;

  // Text-Input,Textarea und tags
  @Input() name!: string;

  // Nur für Slider
  @Input() slider = false;



  error!: string;

  focusOut() {

    if (this.input) {
      if (this.input.nativeElement.value.length === 0) {
        this.label.nativeElement.classList.remove('floating-label-small')
      }
    }

    if (this.textArea) {
      if (this.textArea.nativeElement.value.length === 0) {
        this.label2.nativeElement.classList.remove('floating-label-small')
      }
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

    if (this.value.errors?.['maxlength']) {
      this.error = 'Zu lang.';
    }

    if (this.value.errors?.['pattern']) {
      this.error = 'Keine Sonderzeichen.';
    }

  }

  addHash() {
    const inputValue = this.value.value;
    const words: string[] = inputValue.split(' ');
    const hashedWords: string[] = words.map(word => {

      //console.log(word);

      if (word === '#' || word === '') return '';

      if (!word.startsWith('#')) {
        return `#${word}`
      }

      return word;
    });

    this.value.setValue(hashedWords.join(' '));
  }



}
