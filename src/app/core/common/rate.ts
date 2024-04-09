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

  // Neu
  username!: string;
  userId!: string;
  notesCollectionId!: string;

  // Rezepte
  quelle!: string;

}







