import {BucketResponse} from "./bucket-response";

export class Rate {
  $id!: string;
  title: string = '';
  rating: number = 0;
  imageBuckets: BucketResponse[] | string = [];
  imageBucketsGlobal: BucketResponse[] | string = [];
  tags: string = '';
  rateTopic: string = '';
  username: string = '';
  userId: string = '';
  notesCollectionId: string = '';
  globalRating: number = 0;

  // Child Rates
  childRate: boolean = false;
  parentDocumentId: string = '';
  parentGlobalRating: number[] = [];


  // Recipes
  quelle: string = '';

  // Products
  manufacturer: string = '';
  boughtAt: string = '';

  // Edit / Update Flag
  active: boolean = false;

  tagsGlobal: string = '';
  boughtAtGlobal: string = '';
}

export interface RateResponse {
  $id: string;
  title: string;
  rating: number;
  imageBuckets: BucketResponse[] | string;
  imageBucketsGlobal: BucketResponse[] | string;
  tags: string;
  rateTopic: string;
  username: string;
  userId: string;
  notesCollectionId: string;
  globalRating: number;

  // Child Rates
  childRate: boolean;
  parentDocumentId: string;
  parentGlobalRating: number[];

  // Recipes
  quelle: string;

  // Products
  manufacturer: string;
  boughtAt: string;

  // Edit / Update Flag
  active: boolean;
}










