export class NotificationToSend {

  senderId : number | undefined;
  recipientId: number | undefined;
  notificationType: string;


  constructor(notificationType: string, senderId?: number, recipientId?: number) {
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.notificationType = notificationType;
  }

}
