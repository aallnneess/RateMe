import {BucketResponse} from "./bucket-response";

export class RateBook {
  recipeName!: string;
  source!: string;
  rating!: number;
  notes!: string;
  imageBuckets: BucketResponse[] = [];

  // TODO: Tags in die Form integrieren, ist schon in der Database
  tags: string = '';
}
