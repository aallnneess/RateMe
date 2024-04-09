import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../core/Services/auth.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {DatabaseService} from "../../core/Services/database.service";
import {FileService} from "../../core/Services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {concatMap} from "rxjs";
import {Rate} from "../../core/common/rate";
import {BucketResponse} from "../../core/common/bucket-response";
import {Note} from "../../core/common/note";
import {NodeServerService} from "../../core/Services/node-server.service";
import {NotesService} from "../Service/notes.service";

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrl: './add-rate.component.css'
})
export class AddRateComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);

  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  databaseService: DatabaseService = inject(DatabaseService);
  fileService: FileService = inject(FileService);
  router: Router = inject(Router);
  route = inject(ActivatedRoute);
  nodeServer: NodeServerService = inject(NodeServerService);
  noteService = inject(NotesService);

  form!: FormGroup;

  rateTopic= '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.rateTopic = this.route.snapshot.paramMap.get('id')!;

    switch (this.rateTopic) {

      case 'recipe': {
        this.form = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
          rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
          notes: ['', [Validators.required, Validators.maxLength(500)]],
          tags: ['', [Validators.required]],
          quelle: ['', [Validators.required]]
        });
      } break;

      case '': {}
    }


  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  changeButtonCssClass() {
    if (this.submitButton) {
      //console.log('changeButtonCssClass: ' + this.submitButton.nativeElement.disabled);
      return this.submitButton.nativeElement.disabled;
    }

    return false;

  }

  sendData(images: Blob[]) {

    if (this.form.invalid || images.length === 0) return;

    //console.log('absenden');
    this.submitButton.nativeElement.disabled = true;

    this.fileService.addImage(images).pipe(

      concatMap(result => {
        return this.nodeServer.createNotesCollection(this.form.get('title')?.value).pipe(
          concatMap(collectionResponse => {

            let rate = new Rate();
            rate.rateTopic = this.rateTopic;
            rate.imageBuckets = result as unknown as BucketResponse[];
            rate.title = this.form.get('title')?.value;
            rate.rating = this.form.get('rating')?.value;
            rate.tags = this.form.get('tags')?.value;
            rate.username = this.authService.user()!.name;
            rate.userId = this.authService.user()!.$id;
            rate.notesCollectionId = collectionResponse.$id;

            // Rezept
            rate.quelle = this.form.get('quelle')?.value;

            return this.databaseService.addRate(rate).pipe(
              concatMap( uploadedRate => {
                return this.noteService.addNote(rate.notesCollectionId, new Note(
                  this.form.get('notes')?.value,
                  rate.username,
                  rate.userId
                ))
              })
            );
          })
        );
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('members', {skipLocationChange: true});
      },
    error: (e) => {
        // TODO: Errorbehandlung:
      console.error(e);
    }});

  }

  ngOnDestroy(): void {
  }
}
