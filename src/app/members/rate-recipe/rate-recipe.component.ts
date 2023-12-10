import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileService} from "../../core/Services/file.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {concatMap} from "rxjs";
import {BucketResponse} from "../../core/common/bucket-response";
import {RateBook} from "../../core/common/rate-book";
import {DatabaseService} from "../../core/Services/database.service";

@Component({
  selector: 'app-rate-recipe',
  templateUrl: './rate-recipe.component.html',
  styleUrl: './rate-recipe.component.css'
})
export class RateRecipeComponent implements OnInit {

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  databaseService: DatabaseService = inject(DatabaseService);
  fileService: FileService = inject(FileService);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      recipeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      source: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      notes: ['', [Validators.required, Validators.maxLength(500)]],
      tags: [['']]
    });
  }

  sendData(images: Blob[]) {

    if (this.form.invalid || images.length === 0) return;

    console.log('absenden');

    this.fileService.addImage(images).pipe(
      concatMap(result => {

        let rateBook = new RateBook();
        rateBook.imageBuckets = result as unknown as BucketResponse[];

        rateBook.recipeName = this.form.get('recipeName')?.value;
        rateBook.source = this.form.get('source')?.value;
        rateBook.rating = this.form.get('rating')?.value;
        rateBook.notes = this.form.get('notes')?.value;
        rateBook.tags = this.form.get('tags')?.value;

        console.log(rateBook);
        console.dir(rateBook);

        return this.databaseService.addBookRate(rateBook);
      })
    ).subscribe();

  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

}
