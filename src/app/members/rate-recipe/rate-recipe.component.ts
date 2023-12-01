import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-rate-recipe',
  templateUrl: './rate-recipe.component.html',
  styleUrl: './rate-recipe.component.css'
})
export class RateRecipeComponent implements OnInit {

  images: Blob[] = [];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      recipeName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      source: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      notes: ['', [Validators.required]],
    });
  }

  setImages(blobs: Blob[]) {
    this.images = [...blobs];
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }


}
