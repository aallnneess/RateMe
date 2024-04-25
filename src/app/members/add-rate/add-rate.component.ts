import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../core/Services/auth.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {DatabaseService} from "../../core/Services/database.service";
import {FileService} from "../../core/Services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {concatMap, map} from "rxjs";
import {Rate} from "../../core/common/rate";
import {BucketResponse} from "../../core/common/bucket-response";
import {Note} from "../../core/common/note";
import {NodeServerService} from "../../core/Services/node-server.service";
import {NotesService} from "../Service/notes.service";
import {DataStoreService} from "../Service/data-store.service";
import {StateService, Status} from "../Service/state.service";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {BlobCustom} from "../../core/common/blob-custom";

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
      return this.submitButton.nativeElement.disabled;
    }

    return false;
  }

  sendData(images: Blob[]) {

    if (this.form.invalid || images.length === 0) return;

    //console.log('absenden');
    this.submitButton.nativeElement.disabled = true;

    if (this.parentRate && !this.editRate) {
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
                return this.databaseService.addChildRate(rate.parentDocumentId,rate);
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



    const newImages: Blob[] = this.findNewImages(images);
    console.log('Neue Bilder: ' + newImages.length);


    const deleteImages: BlobGalleryItemContainer[] = this.findToDeleteImages(images);
    console.log('Bilder zu löschen: ' + deleteImages.length);

    this.fileService.addImage(newImages).pipe(
      concatMap(result => {

        console.log('create rate');

        let rate = new Rate();

        console.log(this.editRate);

        rate.$id = this.editRate?.$id!;
        rate.rateTopic = this.rateTopic;
        rate.imageBuckets = this.summarizeImages(this.editRate?.imageBuckets ,result as unknown as BucketResponse[], deleteImages);
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        rate.tags = this.form.get('tags')?.value + ' ';
        rate.username = this.editRate?.username!;
        rate.userId = this.editRate?.userId!;
        rate.notesCollectionId = this.editRate?.notesCollectionId!;
        rate.ratings = this.updateRating(this.editRate?.rating!,this.form.get('rating')?.value,this.editRate?.ratings!);

        if (this.editRate && this.editRate.childRate) {
          rate.childRate = this.editRate?.childRate;
          rate.parentDocumentId = this.editRate?.parentDocumentId;
        }


        // Rezept
        rate.quelle = this.form.get('quelle')?.value;

        return this.databaseService.updateRate(rate).pipe(
          concatMap(result => {

            return this.updateParentRate(rate, deleteImages)
          }),
          concatMap(rate => {
            return this.databaseService.updateRate(rate);
          })
        );
      }),
      concatMap(result => {
        console.log('delete images');

        return this.fileService.removeImage(deleteImages);
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('members', {skipLocationChange: true});
      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
      }
    });




    // TODO: Eltern-Rate imagebucks updaten ?
  }

  findNewImages(images: Blob[]) {
    const newImages: Blob[] = [];

    for (let image of images) {
      let searchImage = image as BlobCustom;
      //console.log('search:' + searchImage.bucketDocumentId);

      if (!this.galleryLoadService.activeRateImages.value.find(i => i.bucketDocumentId === searchImage.bucketDocumentId)) {
        //console.log('Neues Bild');

        newImages.push(image);
      }

    }

    return newImages;
  }

  findToDeleteImages(images: Blob[]) {
    const tmpImages: BlobGalleryItemContainer[] = [];
    const searchImages: BlobCustom[] = images as BlobCustom[];

    const blabla: BucketResponse[] = JSON.parse(this.editRate?.imageBuckets as string);
    const filteredActiveRateImages: BlobGalleryItemContainer[] = this.galleryLoadService.activeRateImages.value.filter(i => {

      if (blabla.find(image => image.$id === i.bucketDocumentId)) {

        return true;
      }

      return false;

    });

    console.log('searchIamges ids: ');
    for (let searchImage of searchImages) {
      console.log(searchImage.bucketDocumentId);
    }

    console.log(' ');
    console.log('activeRateImages ids:');

    for (let blobGalleryItemContainer of filteredActiveRateImages) {
      console.log(blobGalleryItemContainer.bucketDocumentId);


      if (!searchImages.find(i => i.bucketDocumentId === blobGalleryItemContainer.bucketDocumentId)) {
        tmpImages.push(blobGalleryItemContainer);
      }
    }

    return tmpImages;
  }

  summarizeImages(
    originalImages: BucketResponse[] | string | undefined,
    newImages: BucketResponse[],
    toDeleteImages: BlobGalleryItemContainer[]) {

    let updateImages: BucketResponse[] = [];
    let tmpOriginalImages: BucketResponse[] = [];
    if (typeof originalImages === "string") {
      tmpOriginalImages = JSON.parse(originalImages);
    } else {
      tmpOriginalImages = originalImages!;
    }

    // console.log('to delete images:');
    // console.log(toDeleteImages);
    // console.log(' ');
    // console.log('original images:');
    // console.log(tmpOriginalImages);


    // delete images
    if (toDeleteImages.length === 0) {
      updateImages = tmpOriginalImages;
    } else {

      for (let tmpOriginalImage of tmpOriginalImages) {
        if (!toDeleteImages.find(i => i.bucketDocumentId === tmpOriginalImage.$id)) {
          updateImages.push(tmpOriginalImage);
        }
      }
    }

    // add new images
    for (let newImage of newImages) {
      updateImages.push(newImage);
    }

    // console.log(' ');
    // console.log('updated images');
    // console.log(updateImages);
    return updateImages;
  }

  updateRating(oldRating: number, newRating: number, rating: number[]): number[] {

    if (this.editRate?.childRate) {
      console.error('Child Rates have no global ratings!');
      return [];
    }

    // console.log(' ');
    // console.log('rating before:');
    // console.log(rating);
    // console.log('Old Rating:');
    // console.log(oldRating);
    // console.log('New Rating:')
    // console.log(newRating);

    // Prüfen, ob das alte Rating vorhanden ist, bevor es entfernt wird
    const oldRatingIndex = rating.indexOf(oldRating);
    if (oldRatingIndex !== -1) {
      // Eine Kopie der Liste erstellen und das alte Rating entfernen
      const updatedRating = [...rating];
      updatedRating.splice(oldRatingIndex, 1);

      // Das neue Rating hinzufügen und die aktualisierte Liste zurückgeben
      updatedRating.push(newRating);

      // console.log('rating after:');
      // console.log(updatedRating);

      return updatedRating;
    } else {
      console.error('Old rating not found in the list.');
      // Rückgabe der unveränderten Liste, da das alte Rating nicht gefunden wurde
      return rating;
    }
  }

  updateParentRate(rate: Rate, deleteImages: BlobGalleryItemContainer[]) {
    rate.$id = this.editRate?.$id!;

    switch (rate.childRate) {

      // #################################### CASE FALSE ######################################################

      case false:
        console.log('parentRate');
        let rateImageBuckets: BucketResponse[] = [];
        if (typeof rate.imageBuckets === "string") {
          rateImageBuckets = JSON.parse(rate.imageBuckets);
        }

        console.log(rate);
        return this.databaseService.getRatesByParentDocumentId(rate.$id).pipe(
          map(foundRates => {

            for (let foundRate of foundRates) {
              // const imageBuckets: BucketResponse[] = foundRate.imageBuckets as unknown as BucketResponse[];
              const imageBuckets: BucketResponse[] = JSON.parse(foundRate.imageBuckets as string);

              for (let imageBucket of imageBuckets) {
                rateImageBuckets.push(imageBucket);
              }
            }

            rate.imageBuckets = rateImageBuckets;
            return rate;
          })
        );


      // #################################### CASE TRUE ######################################################

      case true:
        console.log('childRate');

        console.log('look to parentid: ' + rate.parentDocumentId);

        return this.databaseService.getRateById(rate.parentDocumentId).pipe(
          map(parentRate => {
            console.log(parentRate.imageBuckets);
            const rateImageBuckets: BucketResponse[] = JSON.parse(parentRate.imageBuckets as string);
            console.log('rateImageBuckets');
            console.log(rateImageBuckets);
            console.log(' ');
            console.log('deleteImages');
            console.log(deleteImages);

            // delete deleted images
            for (let rateImageBucket of rateImageBuckets) {
              if (deleteImages.find(i => i.bucketDocumentId === rateImageBucket.$id)) {
                rateImageBuckets.splice(rateImageBuckets.indexOf(rateImageBucket),1);
                console.log('lösche bild');
              }
            }

            // add new images
            // const childRateImageBuckets: BucketResponse[] = rate.imageBuckets as unknown as BucketResponse[];
            const childRateImageBuckets: BucketResponse[] = JSON.parse(rate.imageBuckets as string);
            console.log(' ');
            console.log('childRateImageBucketss');
            console.log(childRateImageBuckets);

            for (let childRateImageBucket of childRateImageBuckets) {
              if (!rateImageBuckets.find(i => i.$id === childRateImageBucket.$id)) {
                rateImageBuckets.push(childRateImageBucket);
                console.log('füge bild hinzu');
                console.log(childRateImageBucket);
              }
            }

            parentRate.imageBuckets = rateImageBuckets;
            console.log(parentRate.imageBuckets);
            return parentRate;
          })
        )
    }

  }


  ngOnDestroy(): void {
    this.statesService.setStatus(Status.Idle);
  }


}
