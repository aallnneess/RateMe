export class BucketResponse {
  $createdAt!: string;
  $id!: string;
  $updatedAt!: string;
  bucketId!: string;
  chunksTotal!: number;
  chunksUploaded!: number;
  mimeType!: string;
  name!: string;
  signature!: string;
  sizeOriginal!: number;
}
