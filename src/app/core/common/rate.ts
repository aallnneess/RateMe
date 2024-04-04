import {BucketResponse} from "./bucket-response";
import {Note} from "./note";

export class Rate {
  $id!: string;
  $collectionId!: string;
  $databaseId!: string;
  $createdAt!: string;
  title!: string;
  rating!: number;
  imageBuckets: BucketResponse[] = [];
  tags: string = '';

  // Neu
  username!: string;
  userId!: string;
  notes: Note[] = [];

  // Rezepte
  quelle!: string;

}
