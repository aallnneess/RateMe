export class Note {


  constructor(message: string, username: string, userId: string) {
    this.message = message;
    this.username = username;
    this.userId = userId;
  }

  message!: string;
  username!: string;
  userId!: string;
}
