import {GalleryItem, GalleryItemData, GalleryItemType} from "ng-gallery";

export class GalleryItemCustom implements GalleryItem {
  data?: GalleryItemData;
  type?: GalleryItemType;

  // constructor(data: ImageItemData) {
  //   this.data = data;
  // }

  bucketDocumentId!: string;
  userId!: string;
  userName!: string;

}

