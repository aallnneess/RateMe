import {BucketResponse} from "./bucket-response";

export class Rate {
  $id!: string;
  title: string = '';
  rating: number = 0;
  imageBuckets: BucketResponse[] | string = [];
  imageBucketsGlobal: BucketResponse[] | string = [];
  tags: string = '';
  tagsGlobal: string = '';
  rateTopic: string = '';
  username: string = '';
  userId: string = '';
  notesCollectionId: string = '';

  // Child Rates
  childRate: boolean = false;
  parentDocumentId: string = '';
  globalRating: number = 0;

  // Recipes
  quelle: string = '';

  // Products
  manufacturer: string = '';
  boughtAt: string = '';
  boughtAtGlobal: string = '';

  // Edit / Update Flag
  active: boolean = false;
}








