import {Component, ElementRef, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/Services/auth.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {FileService} from "../../core/Services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {concatMap, Subscription, tap} from "rxjs";
import {Rate} from "../../core/common/rate";
import {BucketResponse} from "../../core/common/bucket-response";
import {Note} from "../../core/common/note";
import {NodeServerService} from "../../core/Services/node-server.service";
import {NotesService} from "../Service/notes.service";
import {DataStoreService} from "../Service/data-store.service";
import {StateService, Status} from "../Service/state.service";
import {BlobGalleryItemContainer} from "../../core/common/blob-gallery-item-container";
import {BlobCustom} from "../../core/common/blob-custom";
import {PopupService} from "../../core/Services/popup.service";
import {RecipeTopic} from "./topics/RecipeTopic";
import {ProductTopic} from "./topics/ProductTopic";
import {DatabaseService} from "../Service/database.service";
import {FullScreenLoaderService} from "../../shared/services/full-screen-loader.service";
import {UserService} from "../../core/Services/user.service";

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrl: './add-rate.component.css'
})
export class AddRateComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);
  userService = inject(UserService);

  submitButton!: ElementRef<HTMLButtonElement>;

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);
  databaseService: DatabaseService = inject(DatabaseService);
  fileService: FileService = inject(FileService);
  router: Router = inject(Router);
  route = inject(ActivatedRoute);
  nodeServer: NodeServerService = inject(NodeServerService);
  noteService = inject(NotesService);
  datastoreService = inject(DataStoreService);
  statesService = inject(StateService);
  popupService = inject(PopupService);
  fullScreenLoaderService = inject(FullScreenLoaderService);

  form!: FormGroup;

  rateTopic= '';

  parentRate!: Rate|null;
  editRate!: Rate|null;

  currentFunctionExecutionId = '';

  lastEditOrParentSub!: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.rateTopic = this.route.snapshot.paramMap.get('id')!;

    this.lastEditOrParentSub = this.datastoreService.lastEditOrParentRate$.subscribe(rate => {
      if (rate?.parent) {
        this.parentRate = rate.rate;
      } else if (rate?.edit) {
        this.editRate = rate.rate;
        console.log(this.editRate);
      }

    });


   // ####################################################################################
   // ####################################################################################
   // ####################################################################################
   // ####################################################################################
   // ####################################################################################
   // ####################################################################################
   // ####################################################################################
   //                       TO Edit               ↓


    switch (this.rateTopic) {

      case 'recipe': {
        const recipe = new RecipeTopic(this.statesService, this.rateTopic,this.parentRate,this.editRate);
        this.form = recipe.generateForm(this.fb,this.form);
      } break;

      case 'product': {
        const product = new ProductTopic(this.statesService, this.rateTopic,this.parentRate,this.editRate);
        this.form = product.generateForm(this.fb,this.form);
      } break;

      case '': {} break;
    }



    //                      TO Edit               ↑
    // ####################################################################################
    // ####################################################################################
    // ####################################################################################
    // ####################################################################################
    // ####################################################################################
    // ####################################################################################
    // ####################################################################################


  }

  sendData(images: Blob[]) {

    console.log('Send Data Form Valid ? ' + this.form.valid);
    if (this.form.invalid || images.length === 0) return;

    this.fullScreenLoaderService.setLoadingOn();

    console.log('absenden');
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
      concatMap(bucketResponses => {

        // ###################### TO EDIT ##############################################################

        let rate = new Rate();
        rate.rateTopic = this.rateTopic;
        rate.imageBuckets = bucketResponses as unknown as BucketResponse[];
        rate.imageBucketsGlobal = bucketResponses as unknown as BucketResponse[];
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        let tags = this.form.get('tags')?.value;
        rate.tags = tags.trim() + ' ';
        rate.tagsGlobal = rate.tags;
        rate.username = this.userService.user()!.name;
        rate.userId = this.userService.user()!.$id;

        // Recipe
        rate.quelle = this.form.get('quelle')?.value;
        rate.globalRating = rate.rating;

        // Product
        rate.manufacturer = this.form.get('manufacturer')?.value;
        rate.boughtAt = this.form.get('boughtAt')?.value;
        rate.boughtAtGlobal = rate.boughtAt;


        return this.databaseService.addRate(rate).pipe(
          concatMap(rateResult => {
            return this.nodeServer.createNotesCollection(
              this.form.get('title')?.value,
              rateResult.$id,
              rateResult.$databaseId,
              rateResult.$collectionId,
              this.form.get('notes')?.value,
              rate.username,
              rate.userId,
              Date.now()).pipe(
                tap(functionResponse => {
                  this.currentFunctionExecutionId = functionResponse.$id;
                }),
            )
          })
        )
      }),
    ).subscribe({
      next: () => {
        this.nodeServer.getFunctionStatus(this.currentFunctionExecutionId).then(status => {
          console.log('status: ' + status);
          this.currentFunctionExecutionId = '';

          this.datastoreService.updateRates().subscribe(() => {
            this.router.navigateByUrl('members');
          });
        });



      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
        this.popupService.setErrorMessage('Verbindung fehlgeschlagen.');
        this.submitButton.nativeElement.disabled = false;
      }})
  }

  // ################## CHILD #########################

  childSend(images: Blob[]) {
    this.fileService.addImage(images).pipe(

          concatMap(result => {

            // console.log('child send images:');
            // console.log(result);

            // ###################### TO EDIT ##############################################################

            let rate = new Rate();
            rate.rateTopic = this.rateTopic;
            rate.imageBuckets = result as unknown as BucketResponse[];
            rate.title = this.form.get('title')?.value;
            rate.rating = this.form.get('rating')?.value;

            rate.tags = this.removeParentTags(this.form.get('tags')?.value, this.parentRate?.tags!);

            rate.username = this.userService.user()!.name;
            rate.userId = this.userService.user()!.$id;
            rate.notesCollectionId = this.parentRate!.notesCollectionId;
            rate.parentDocumentId = this.parentRate!.$id;
            rate.childRate = true;

            // Recipe
            rate.quelle = this.form.get('quelle')?.value;

            // Product
            rate.manufacturer = this.form.get('manufacturer')?.value;
            rate.boughtAt = this.form.get('boughtAt')?.value;

            return this.databaseService.addRate(rate).pipe(
              concatMap( () => {
                return this.noteService.addNote(rate.notesCollectionId, new Note(
                  this.form.get('notes')?.value,
                  rate.username,
                  rate.userId
                ))
              }),
              concatMap(() => {
                return this.nodeServer.checkGlobalRate(rate.parentDocumentId);
              })
            );
          })
        )
      .subscribe({
      next: () => {

        //Rates müssen vor route wechsel aktualisiert werden
        this.datastoreService.updateRates().subscribe(() => {
          this.router.navigateByUrl('members');
        });

      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
        this.popupService.setErrorMessage('Verbindung fehlgeschlagen');
        this.submitButton.nativeElement.disabled = false;
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

        // ###################### TO EDIT ##############################################################

        rate.$id = this.editRate?.$id!;
        rate.rateTopic = this.rateTopic;
        rate.imageBuckets = this.summarizeImages(this.editRate?.imageBuckets ,result as unknown as BucketResponse[], deleteImages);
        rate.imageBucketsGlobal = JSON.parse(this.editRate?.imageBucketsGlobal as unknown as string) as BucketResponse[];
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        let tags = this.form.get('tags')?.value;
        rate.tags = tags.trim() + ' ';
        rate.username = this.editRate?.username!;
        rate.userId = this.editRate?.userId!;
        rate.notesCollectionId = this.editRate?.notesCollectionId!;

        if (this.editRate && this.editRate.childRate) {
          rate.childRate = this.editRate?.childRate;
          rate.parentDocumentId = this.editRate?.parentDocumentId;
        }

        // Rezept
        rate.quelle = this.form.get('quelle')?.value;

        // Product
        rate.manufacturer = this.form.get('manufacturer')?.value;
        rate.boughtAt = this.form.get('boughtAt')?.value;

        return this.databaseService.updateRate(rate).pipe(
          concatMap(() => {

            let parentRateId = '';
            if (rate.parentDocumentId) {
              parentRateId = rate.parentDocumentId;
            } else {
              parentRateId = rate.$id;
            }

            console.log('##### parentid: ' + parentRateId);

            return this.nodeServer.checkGlobalRate(parentRateId);
          })
        );
      }),
      concatMap(result => {
        console.log('delete images');
        // TODO: Hä ? wasn das hier

        return this.fileService.removeImage(deleteImages);
      })
    ).subscribe({
      next: () => {
        this.datastoreService.updateRates().subscribe(() => {
          this.router.navigateByUrl('members');
        });

      },
      error: (e) => {
        // TODO: Errorbehandlung:
        console.error(e);
        this.popupService.setErrorMessage('Verbindung fehlgeschlagen.');
        this.submitButton.nativeElement.disabled = false;
      }
    });

  }

  findNewImages(images: Blob[]) {
    const newImages: Blob[] = [];

    for (let image of images) {
      let searchImage = image as BlobCustom;
      console.log('search:' + searchImage.bucketDocumentId);

      if (!this.galleryLoadService.activeRateImages.value.find(i => i.bucketDocumentId === searchImage.bucketDocumentId)) {
        console.log('Neues Bild');

        newImages.push(image);
      }

    }

    return newImages;
  }

  findToDeleteImages(images: Blob[]): BlobGalleryItemContainer[] {
    const tmpImages: BlobGalleryItemContainer[] = [];
    const searchImages: BlobCustom[] = images as BlobCustom[];

    let blabla: BucketResponse[] = [];

    if (typeof this.editRate?.imageBuckets === 'string') {
      blabla = JSON.parse(this.editRate?.imageBuckets as string);
    } else {
      blabla = this.editRate?.imageBuckets as BucketResponse[];
    }

    const filteredActiveRateImages: BlobGalleryItemContainer[] = this.galleryLoadService.activeRateImages.value.filter(i => {
      return blabla.some(image => image.$id === i.bucketDocumentId);
    });

    console.log('searchIamges ids:');
    searchImages.forEach(searchImage => {
      console.log(searchImage.bucketDocumentId);
    });

    console.log(' ');
    console.log('activeRateImages ids:');
    filteredActiveRateImages.forEach(blobGalleryItemContainer => {
      console.log(blobGalleryItemContainer.bucketDocumentId);

      if (!searchImages.some(i => i.bucketDocumentId === blobGalleryItemContainer.bucketDocumentId)) {
        tmpImages.push(blobGalleryItemContainer);
      }
    });

    return tmpImages;
  }

  summarizeImages(
    originalImages: BucketResponse[] | string | undefined,
    newImages: BucketResponse[],
    toDeleteImages: BlobGalleryItemContainer[]
  ): BucketResponse[] {
    let updateImages: BucketResponse[] = [];
    let tmpOriginalImages: BucketResponse[] = [];

    if (typeof originalImages === 'string') {
      tmpOriginalImages = JSON.parse(originalImages);
    } else if (originalImages) {
      tmpOriginalImages = originalImages;
    }

    console.log('to delete images:');
    console.log(toDeleteImages);
    console.log(' ');
    console.log('original images:');
    console.log(tmpOriginalImages);

    // delete images
    if (toDeleteImages.length === 0) {
      updateImages = tmpOriginalImages;
    } else {
      for (let tmpOriginalImage of tmpOriginalImages) {
        if (!toDeleteImages.some(i => i.bucketDocumentId === tmpOriginalImage.$id)) {
          updateImages.push(tmpOriginalImage);
        }
      }
    }

    // add new images
    updateImages = updateImages.concat(newImages);

    console.log(' ');
    console.log('updated images');
    console.log(updateImages);

    return updateImages;
  }


  ngOnDestroy(): void {
    this.statesService.setStatus(Status.Idle);
    this.lastEditOrParentSub.unsubscribe();
    this.datastoreService.setEditOrParentRateToNull();
  }


  private removeParentTags(formTags: string, parentTags: string): string {
    // Zerlege formTags und parentTags in Arrays
    const formTagsArray = formTags.split(' ').map(tag => tag.trim());
    const parentTagsArray = parentTags.split(' ').map(tag => tag.trim());

    // Filtere formTagsArray, um parentTags zu entfernen
    const filteredTagsArray = formTagsArray.filter(tag => !parentTagsArray.includes(tag));

    // Füge die bereinigten Tags wieder zu einem String zusammen
    return filteredTagsArray.join(' ');
  }

}
