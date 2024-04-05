export class CollectionResponse {
  $id!: string;
  $createdAt!: string;
  $updatedAt!: string;
  $permissions!: string[];
  databaseId!: string;
  name!: string;
  enabled!: boolean;
  documentSecurity!: boolean;
  attributes!: Attribute[];
  indexes!: Index[];
}

export class Attribute {
  key!: string;
  type!: string;
  status!: string;
  error!: string;
  required!: boolean;
  array!: boolean;
  default!: boolean;
}

export class Index {
  key!: string;
  type!: string;
  status!: string;
  error!: string;
  attributes!: string[];
  orders!: string[];
}
