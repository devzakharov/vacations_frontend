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
  distributedWorkingDays : number = 0;
  twoWeeksInRow : boolean = false;

  setConditionsFlag() {
    this.conditionsFlag = this.checkConditions();
  }

  checkConditions() : boolean {
    return (this.distributedDays === 28) && this.twoWeeksInRow && (moment().diff(moment(this.deadline, 'DD.MM.YYYY'), 'days') < 0);
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

  refreshDistributedWorkingDays () {
    this.vacationService.getDistributedWorkingDays().subscribe(response => {
      console.log(response);
      if (response == null) {
        this.distributedWorkingDays = 0;
      } else {
        this.distributedWorkingDays = response;
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
          this.setConditionsFlag();
        }
        this.setConditionsFlag();
      }, error => {
        console.log(error);
      }
    );
  }
}
