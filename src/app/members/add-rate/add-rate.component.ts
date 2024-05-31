import {Component, ElementRef, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/Services/auth.service";
import {GalleryLoadService} from "../Service/gallery-load.service";
import {FileService} from "../../core/Services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {concatMap, map, Subscription, tap} from "rxjs";
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

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrl: './add-rate.component.css'
})
export class AddRateComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);

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
      concatMap(bucketResponses => {

        // ###################### TO EDIT ##############################################################

        let rate = new Rate();
        rate.rateTopic = this.rateTopic;
        rate.imageBuckets = bucketResponses as unknown as BucketResponse[];
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        rate.tags = this.form.get('tags')?.value + ' ';
        rate.tagsGlobal = rate.tags;
        rate.username = this.authService.user()!.name;
        rate.userId = this.authService.user()!.$id;
        rate.globalRating = rate.rating;

        // Recipe
        rate.quelle = this.form.get('quelle')?.value;

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
      })
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
        this.popupService.setErrorMessage(e);
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

            // rate.tags = this.form.get('tags')?.value;
            rate.tags = this.removeParentTags(this.form.get('tags')?.value, this.parentRate?.tags!);

            rate.username = this.authService.user()!.name;
            rate.userId = this.authService.user()!.$id;
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
                if (rate.childRate) {
                  return this.databaseService.updateParentsGlobalAttributes(rate.parentDocumentId);
                } else {
                  return this.databaseService.updateParentsGlobalAttributes(rate.$id);
                }
              }),
              concatMap(() => {
                // get parent rate to update image bucket
                return this.databaseService.getRateById(rate.parentDocumentId);
              }),
              concatMap(parentRate => {

                if (typeof parentRate.imageBuckets === 'string') {
                  parentRate.imageBuckets = JSON.parse(parentRate.imageBuckets);
                }

                if (typeof rate.imageBuckets === 'string') {
                  rate.imageBuckets = JSON.parse(rate.imageBuckets);
                }

                if (typeof parentRate.imageBuckets !== 'string') {
                  for (let imageBucket of rate.imageBuckets) {
                    parentRate.imageBuckets.push(imageBucket as BucketResponse);
                  }
                }

                // update parentRate
                return this.databaseService.updateRate(parentRate);
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
        this.popupService.setErrorMessage(e);
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
        rate.title = this.form.get('title')?.value;
        rate.rating = this.form.get('rating')?.value;
        rate.tags = this.form.get('tags')?.value + ' ';
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
          concatMap(result => {

            return this.updateParentRate(rate, deleteImages)
          }),
          concatMap(rate => {
            return this.databaseService.updateRate(rate);
          }),
          concatMap(() => {
            if (rate.childRate) {
              console.log('Childrate');
              return this.databaseService.updateParentsGlobalAttributes(rate.parentDocumentId);
            } else {
              console.log('ParentRate');
              console.log(this.editRate?.$id);
              return this.databaseService.updateParentsGlobalAttributes(this.editRate?.$id!);
            }
          })
        );
      }),
      concatMap(result => {
        console.log('delete images');

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
        this.popupService.setErrorMessage(e);
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

  // findToDeleteImages(images: Blob[]) {
  //   const tmpImages: BlobGalleryItemContainer[] = [];
  //   const searchImages: BlobCustom[] = images as BlobCustom[];
  //
  //   let blabla: BucketResponse[] = [];
  //
  //   if (typeof this.editRate?.imageBuckets === 'string') {
  //     blabla = JSON.parse(this.editRate?.imageBuckets as string);
  //   }else {
  //     blabla = this.editRate?.imageBuckets as BucketResponse[];
  //   }
  //
  //   const filteredActiveRateImages: BlobGalleryItemContainer[] = this.galleryLoadService.activeRateImages.value.filter(i => {
  //
  //     if (blabla.find(image => image.$id === i.bucketDocumentId)) {
  //
  //       return true;
  //     }
  //
  //     return false;
  //
  //   });
  //
  //   console.log('searchIamges ids: ');
  //   for (let searchImage of searchImages) {
  //     console.log(searchImage.bucketDocumentId);
  //   }
  //
  //   console.log(' ');
  //   console.log('activeRateImages ids:');
  //
  //   for (let blobGalleryItemContainer of filteredActiveRateImages) {
  //     console.log(blobGalleryItemContainer.bucketDocumentId);
  //
  //
  //     if (!searchImages.find(i => i.bucketDocumentId === blobGalleryItemContainer.bucketDocumentId)) {
  //       tmpImages.push(blobGalleryItemContainer);
  //     }
  //   }
  //
  //   return tmpImages;
  // }

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


  // summarizeImages(
  //   originalImages: BucketResponse[] | string | undefined,
  //   newImages: BucketResponse[],
  //   toDeleteImages: BlobGalleryItemContainer[]) {
  //
  //   let updateImages: BucketResponse[] = [];
  //   let tmpOriginalImages: BucketResponse[] = [];
  //   if (typeof originalImages === "string") {
  //     tmpOriginalImages = JSON.parse(originalImages);
  //   } else {
  //     tmpOriginalImages = originalImages!;
  //   }
  //
  //    console.log('to delete images:');
  //    console.log(toDeleteImages);
  //    console.log(' ');
  //    console.log('original images:');
  //    console.log(tmpOriginalImages);
  //
  //
  //   // delete images
  //   if (toDeleteImages.length === 0) {
  //     updateImages = tmpOriginalImages;
  //   } else {
  //
  //     for (let tmpOriginalImage of tmpOriginalImages) {
  //       if (!toDeleteImages.find(i => i.bucketDocumentId === tmpOriginalImage.$id)) {
  //         updateImages.push(tmpOriginalImage);
  //       }
  //     }
  //   }
  //
  //   // add new images
  //   for (let newImage of newImages) {
  //     updateImages.push(newImage);
  //   }
  //
  //    console.log(' ');
  //    console.log('updated images');
  //    console.log(updateImages);
  //   return updateImages;
  // }

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
            // console.log(parentRate.imageBuckets);
            const rateImageBuckets: BucketResponse[] = JSON.parse(parentRate.imageBuckets as string);
            // console.log('rateImageBuckets');
            // console.log(rateImageBuckets);
            // console.log(' ');
            // console.log('deleteImages');
            // console.log(deleteImages);

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
            console.log('childRateImageBuckets');
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
