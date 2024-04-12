export class Note {


  constructor(message: string, username: string, userId: string) {
    this.message = message;
    this.username = username;
    this.userId = userId;
    this.date = Date.now();
  }

  message!: string;
  username!: string;
  userId!: string;
  date!: number;

  $id!: string;
  $databaseId!: string;
  $collectionId!: string;
  $createdAt!: string;
  $updatedAt!: string;
}
