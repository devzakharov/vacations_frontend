import {VacationTransferPeriod} from "./VacationTransferPeriod";

export class VacationTransfer {

  id : number;
  vacationId : number;
  responsibleId : number;
  responsibleApproval : boolean;
  vacationTransferPeriodList : VacationTransferPeriod[];

  constructor(vacationId : number) {
    this.id = 0;
    this.vacationId = vacationId;
    this.responsibleId = 0;
    this.responsibleApproval = false;
    this.vacationTransferPeriodList = [];
  }

}
