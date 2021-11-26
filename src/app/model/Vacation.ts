export class Vacation {

  id : number;
  dateFrom : string;
  dateTo : string;
  message : string;
  vacationType : string;
  userId : number;
  departmentHeadApproval : string;
  vacationOrder : any;
  vacationStatement : any;
  vacationPayCalculated : boolean;


  constructor(id : number, dateFrom: string, dateTo: string, message: string, vacationType: string, userId: number, departmentHeadApproval : string, vacationPayCalculated : boolean) {
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.message = message;
    this.vacationType = vacationType;
    this.userId = userId;
    this.id = id;
    this.departmentHeadApproval = departmentHeadApproval;
    this.vacationPayCalculated = vacationPayCalculated;
  }

}
