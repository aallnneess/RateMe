import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileService} from "../../core/Services/file.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {concatMap} from "rxjs";
import {BucketResponse} from "../../core/common/bucket-response";
import {RateBook} from "../../core/common/rate-book";
import {DatabaseService} from "../../core/Services/database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-rate-recipe',
  templateUrl: './rate-recipe.component.html',
  styleUrl: './rate-recipe.component.css'
})
export class RateRecipeComponent implements OnInit {

  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  databaseService: DatabaseService = inject(DatabaseService);
  fileService: FileService = inject(FileService);
  router: Router = inject(Router);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  changeButtonCssClass() {
    if (this.submitButton) {
      //console.log('changeButtonCssClass: ' + this.submitButton.nativeElement.disabled);
      return this.submitButton.nativeElement.disabled;
    }

    return false;

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      recipeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      source: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      notes: ['', [Validators.required, Validators.maxLength(500)]],
      tags: ['']
    });

  }

  sendData(images: Blob[]) {

    if (this.form.invalid || images.length === 0) return;

    console.log('absenden');
    this.submitButton.nativeElement.disabled = true;

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
    ).subscribe(() => {
      this.router.navigateByUrl('members', {skipLocationChange: true})
    }) ;

  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }


}
