import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-member-input',
  templateUrl: './member-input.component.html',
  styleUrl: './member-input.component.css'
})
export class MemberInputComponent implements OnInit, AfterViewInit {

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('label') label!: ElementRef<HTMLLabelElement>;
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('label2') label2!: ElementRef<HTMLLabelElement>;


  @Input({ required: true }) value!: FormControl;
  @Input({ required: true }) labelInputId!: string;
  @Input() disabled: boolean = false;

  // Nur für Text-Input
  @Input() textFieldType!: string;
  @Output() textChange = new EventEmitter<string>();

  // Nur für Textarea
  @Input() textarea = false;

  // Nur für tags
  @Input() tags = false;
  parentTags!: string;
  @Input() tagsCanBeEdited = false;

  // Text-Input,Textarea und tags
  @Input() name!: string;

  // Nur für Slider
  @Input() slider = false;

  ngOnInit(): void {
  }



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
    let inputValue = this.value.value;

    // user cant delete parent tags
    if (this.parentTags && !this.tagsCanBeEdited) {

      inputValue = this.parentTags + inputValue.substring(this.parentTags.length);

      if (inputValue.length < this.parentTags.length) {
        inputValue = this.parentTags;
      }
    }


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

  onKeyDown(event: KeyboardEvent) {
    if (!this.tagsCanBeEdited && event.key.startsWith('Arrow')) {
      event.preventDefault(); // Verhindert die Standardaktion der Pfeiltasten im Inputfeld
    }
  }

  ngAfterViewInit(): void {
    if (this.input) {

      if (this.input.nativeElement.value.length > 0) {
        this.label.nativeElement.classList.toggle('floating-label-small');
      }

      if (this.disabled) {
        this.input.nativeElement.disabled = true;
      }
    }

    if (this.textarea) {

      if (this.textArea.nativeElement.value.length > 0) {
        this.label2.nativeElement.classList.toggle('floating-label-small');
      }

      if (this.disabled) {
        this.textArea.nativeElement.disabled = true;
      }
    }

    // if there a parent rate, user cant delete parent tags
    if (this.tags) {
      if (this.value.value) {
        this.parentTags= this.value.value;
      }
    }
  }

  setFocus() {
   if (this.input) {
      this.input.nativeElement.focus();
      console.log('Set focus');
    }
  }


  getSliderValue() {
    return this.value.value;
  }
}
