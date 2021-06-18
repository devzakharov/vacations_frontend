import { Injectable } from '@angular/core';
import * as moment from "moment";
import {VacationService} from "../vacation/vacation.service";

@Injectable({
  providedIn: 'root'
})
export class ConditionService {

  constructor(private vacationService : VacationService) { }

  conditionsFlag: boolean = false;
  deadline : string = '';
  distributedDays : number = 0;
  twoWeeksInRow : boolean = false;

  setConditionsFlag() {
    // console.log('CONDITIONS CHECKED');
    this.conditionsFlag = this.checkConditions();
    // console.log(this.conditionsFlag);
    // console.log(this.distributedDays);
  }

  checkConditions() : boolean {
    return (this.distributedDays === 28) && this.twoWeeksInRow && (moment().diff(moment(this.deadline)) > 0);
  }

  refreshDistributedDays () {
    this.vacationService.getDistributedDays().subscribe(response => {
      if (response == null) {
        this.distributedDays = 0;
      } else {
        this.distributedDays = response;
        this.setConditionsFlag();
      }
    }, error => {
      console.log(error);
    });
  }

  twoWeeksVacationCheck() {
    this.vacationService.getMaxDaysInARow().subscribe(
      response => {
        if (response === 14) {
          this.twoWeeksInRow = true;
        }
      }, error => {
        console.log(error);
      }
    );
  }
}
