export class VacationTransferPeriod {

  id: number;
  dateFrom : string;
  dateTo : string;

  constructor(dateFrom: string, dateTo: string) {
    this.id = 0;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }
}
