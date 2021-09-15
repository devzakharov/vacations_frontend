export class UserNotification {

  id: number;
  recipientId : number;
  header: string;
  message: string;


  constructor(id: number, header: string, message: string, recipientId: number) {
    this.id = id;
    this.header = header;
    this.message = message;
    this.recipientId = recipientId;
  }

}
