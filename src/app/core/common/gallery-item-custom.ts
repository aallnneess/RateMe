import {GalleryItem, GalleryItemData, GalleryItemType} from "ng-gallery";

export class GalleryItemCustom implements GalleryItem {
  data?: GalleryItemData;
  type?: GalleryItemType;

  bucketDocumentId!: string;
  userId!: string;
  userName!: string;
  updatedAt!: string;

}

