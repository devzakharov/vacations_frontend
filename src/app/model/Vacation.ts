export class Vacation {

  id : number;
  date_from : string;
  date_to : string;
  message : string;
  vacation_type : string;
  user_id : number;


  constructor(id : number, date_from: string, date_to: string, message: string, vacation_type: string, user_id: number) {
    this.date_from = date_from;
    this.date_to = date_to;
    this.message = message;
    this.vacation_type = vacation_type;
    this.user_id = user_id;
    this.id = id;
  }

}
