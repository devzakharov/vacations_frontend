export class RestDay {
  id : number;
  date : string;
  status : string;

  constructor(id: number, date: string, status: string) {
    this.id = id;
    this.date = date;
    this.status = status;
  }
}
