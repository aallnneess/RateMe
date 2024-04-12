import {BucketResponse} from "./bucket-response";

export class Rate {
  $id!: string;
  $collectionId!: string;
  $databaseId!: string;
  $createdAt!: string;
  title!: string;
  rating!: number;
  imageBuckets: BucketResponse[] = [];
  tags: string = '';
  rateTopic: string = '';
  username!: string;
  userId!: string;
  notesCollectionId!: string;

  // Child Rates
  childRate: boolean = false;
  parentDocumentId!: string;
  ratings!: number[];

  // Rezepte
  quelle!: string;

}







