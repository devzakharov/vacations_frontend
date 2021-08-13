export class Vacation {

  id : number;
  date_from : string;
  date_to : string;
  message : string;
  vacation_type : string;
  user_id : number;
  department_head_approval : string;


  constructor(id : number, date_from: string, date_to: string, message: string, vacation_type: string, user_id: number, department_head_approval : string) {
    this.date_from = date_from;
    this.date_to = date_to;
    this.message = message;
    this.vacation_type = vacation_type;
    this.user_id = user_id;
    this.id = id;
    this.department_head_approval = department_head_approval;
  }

}
