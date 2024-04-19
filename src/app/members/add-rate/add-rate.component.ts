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
import {DataStoreService} from "../Service/data-store.service";
import {StateService, Status} from "../Service/state.service";

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
  datastoreService = inject(DataStoreService);
  statesService = inject(StateService);

  form!: FormGroup;

  rateTopic= '';

  parentRate!: Rate|null;
  editRate!: Rate|null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

   this.rateTopic = this.route.snapshot.paramMap.get('id')!;
   // If its a child rate, this is not null
   this.parentRate = JSON.parse(this.route.snapshot.paramMap.get('rate')!);
   // If its a edit rate, this is not null
   this.editRate = JSON.parse(this.route.snapshot.paramMap.get('editRate')!);


    switch (this.rateTopic) {

      case 'recipe': {

        if (this.parentRate) {
          this.form = this.fb.group({
            title: [this.parentRate.title, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            rating: [this.parentRate.rating, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            notes: ['', [Validators.required, Validators.maxLength(2000)]],
            tags: [this.parentRate.tags, [Validators.required]],
            quelle: ['', [Validators.required]]
          });
        } else if (this.editRate) {
          this.statesService.setStatus(Status.Edit);
          this.form = this.fb.group({
            title: [this.editRate.title, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            rating: [this.editRate.rating, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            notes: [' ', [Validators.required, Validators.maxLength(2000)]],
            tags: [this.editRate.tags, [Validators.required]],
            quelle: [this.editRate.quelle, [Validators.required]]
          });
        } else {
          this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
            notes: ['', [Validators.required, Validators.maxLength(2000)]],
            tags: ['', [Validators.required]],
            quelle: ['', [Validators.required]]
          });
        }
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

    if (this.parentRate) {
      this.childSend(images);
    } else if (this.editRate) {
      this.editSend(images);
    } else {
      this.normalSend(images);
    }

  }

  normalSend(images: Blob[]) {
    this.fileService.addImage(images).pipe(

      concatMap(result => {
        return this.nodeServer.createNotesCollection(this.form.get('title')?.value).pipe(
          concatMap(collectionResponse => {

            let rate = new Rate();
            rate.rateTopic = this.rateTopic;
            rate.imageBuckets = result as unknown as BucketResponse[];
            rate.title = this.form.get('title')?.value;
            rate.rating = this.form.get('rating')?.value;
            rate.tags = this.form.get('tags')?.value + ' ';
            rate.username = this.authService.user()!.name;
            rate.userId = this.authService.user()!.$id;
            rate.notesCollectionId = collectionResponse.$id;
            rate.ratings = [rate.rating];

            // Rezept
            rate.quelle = this.form.get('quelle')?.value;

            return this.databaseService.addRate(rate).pipe(
              // TODO: Rating beim Eltern-Rate ändern. ratings[] wird nur hier gefüllt.
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

        // Rates müssen vor route wechsel aktualisiert werden
        this.datastoreService.updateRates().subscribe(() => {
          this.router.navigateByUrl('members', {skipLocationChange: true});
        });

      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
      }});
  }


  // ################## CHILD #########################

  childSend(images: Blob[]) {
    this.fileService.addImage(images).pipe(

          concatMap(result => {

            let rate = new Rate();
            rate.rateTopic = this.rateTopic;
            rate.imageBuckets = result as unknown as BucketResponse[];
            rate.title = this.form.get('title')?.value;
            rate.rating = this.form.get('rating')?.value;
            rate.tags = this.form.get('tags')?.value;
            rate.username = this.authService.user()!.name;
            rate.userId = this.authService.user()!.$id;
            rate.notesCollectionId = this.parentRate!.notesCollectionId;
            rate.parentDocumentId = this.parentRate!.$id;
            rate.childRate = true;

            // Rezept
            rate.quelle = this.form.get('quelle')?.value;

            return this.databaseService.addRate(rate).pipe(
              concatMap( () => {
                return this.noteService.addNote(rate.notesCollectionId, new Note(
                  this.form.get('notes')?.value,
                  rate.username,
                  rate.userId
                ))
              }),
              concatMap(() => {
                return this.databaseService.updateRating(rate.parentDocumentId,rate);
              })
            );
          })
        )
      .subscribe({
      next: () => {

        // Rates müssen vor route wechsel aktualisiert werden
        this.datastoreService.updateRates().subscribe(() => {
          this.router.navigateByUrl('members', {skipLocationChange: true});
        });

      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
      }});
  }

  // ################## EDIT #########################

  editSend(images: Blob[]) {


    console.log(this.editRate?.imageBuckets);
    console.log(' ');
    console.log(images);
    console.log(' ');
    console.log(this.galleryLoadService.activeRateImages.value);

    return;






    this.fileService.addImage(images).pipe(

      concatMap(result => {

        let rate = new Rate();
        rate.rateTopic = this.rateTopic;
        rate.imageBuckets = result as unknown as BucketResponse[];
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        rate.tags = this.form.get('tags')?.value;
        rate.username = this.authService.user()!.name;
        rate.userId = this.authService.user()!.$id;
        rate.notesCollectionId = this.parentRate!.notesCollectionId;
        rate.parentDocumentId = this.parentRate!.$id;
        rate.childRate = true;

        // Rezept
        rate.quelle = this.form.get('quelle')?.value;

        return this.databaseService.addRate(rate).pipe(
          concatMap( () => {
            return this.noteService.addNote(rate.notesCollectionId, new Note(
              this.form.get('notes')?.value,
              rate.username,
              rate.userId
            ))
          }),
          concatMap(() => {
            return this.databaseService.updateRating(rate.parentDocumentId,rate);
          })
        );
      })
    )
      .subscribe({
        next: () => {

          // Rates müssen vor route wechsel aktualisiert werden
          this.datastoreService.updateRates().subscribe(() => {
            this.router.navigateByUrl('members', {skipLocationChange: true});
          });

        },
        error: (e) => {
          // TODO: Errorbehandlung:
          console.error(e);
        }});
  }

  ngOnDestroy(): void {
    this.statesService.setStatus(Status.Idle);
  }
}
