export class UserNotification {

  id: number;
  senderId : number;
  recipientId : number | undefined;
  header: string;
  message: string;


  constructor(id: number, header: string, message: string, senderId : number, recipientId?: number) {
    this.id = id;
    this.header = header;
    this.message = message;
    this.senderId = senderId;
    this.recipientId = recipientId;
  }

}
