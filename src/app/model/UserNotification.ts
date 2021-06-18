export class UserNotification {

  private _id: number;
  private _header: string;
  private _message: string;
  private _notificationType: string;
  private _created: string;


  constructor(id: number, header: string, message: string, notificationType: string, created: string) {
    this._id = id;
    this._header = header;
    this._message = message;
    this._notificationType = notificationType;
    this._created = created;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get header(): string {
    return this._header;
  }

  set header(value: string) {
    this._header = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  get notificationType(): string {
    return this._notificationType;
  }

  set notificationType(value: string) {
    this._notificationType = value;
  }

  get created(): string {
    return this._created;
  }

  set created(value: string) {
    this._created = value;
  }
}
