import {BucketResponse} from "./bucket-response";
import {Note} from "./note";

export class RateBook {
  recipeName!: string;
  source!: string;
  rating!: number;
  // notes!: string;
  imageBuckets: BucketResponse[] = [];
  tags: string = '';

  // Neu
  username!: string;
  userId!: string;
  notes: Note[] = [];

}
