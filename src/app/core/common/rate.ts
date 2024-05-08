import {BucketResponse} from "./bucket-response";

export class Rate {
  $id!: string;
  title: string = '';
  rating: number = 0;
  imageBuckets: BucketResponse[] | string = [];
  tags: string = '';
  rateTopic: string = '';
  username: string = '';
  userId: string = '';
  notesCollectionId: string = '';

  // Child Rates
  childRate: boolean = false;
  parentDocumentId: string = '';
  ratings: number[] = [];

  // Recipes
  quelle: string = '';

  // Products
  manufacturer: string = '';
  boughtAt: string = '';

}








