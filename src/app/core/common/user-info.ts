export class UserInfo {
  $id!: string;
  $createdAt!: string;
  $updatedAt!: string;
  name!: string;
  password!: string;
  hash!: string;
  hashOptions: any = {};
  registration!: string;
  status!: boolean;
  labels!: string;
  passwordUpdate!: string;
  email!: string;
  phone!: string;
  emailVerification!: boolean;
  phoneVerification!: boolean;
  prefs: any = {};
  accessedAt!: string;
}
