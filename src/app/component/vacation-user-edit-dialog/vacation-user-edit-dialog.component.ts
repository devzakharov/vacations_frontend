import {Component, Inject, OnInit} from '@angular/core';
import {Vacation} from "../../model/Vacation";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VacationService} from "../../service/vacation/vacation.service";
import {NotificationService} from "../../service/notification/notification.service";
import {HeaderService} from "../../service/header/header.service";
import {NotificationToSend} from "../../model/NotificationToSend";
import {VacationTransferPeriod} from "../../model/VacationTransferPeriod";
import {extendMoment} from "moment-range";
import * as moment from 'moment';
import {NotifierService} from "angular-notifier";
import {VacationTransfer} from "../../model/VacationTransfer";

@Component({
  selector: 'app-vacation-user-edit-dialog',
  templateUrl: './vacation-user-edit-dialog.component.html',
  styleUrls: ['./vacation-user-edit-dialog.component.css']
})
export class VacationUserEditDialogComponent implements OnInit {

  //@ts-ignore
  vacation : Vacation;
  vacationTransferPeriods : VacationTransferPeriod[] = [];
  workingDaysLimit : number = 0;
  transferredWorkingDays : number = 0;
  calendarDaysLimit : number = 0;
  transferredCalendarDays : number = 0;

  constructor(
    public dialogRef: MatDialogRef<VacationUserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vacationService : VacationService,
    private notificationService : NotificationService,
    private headerService : HeaderService,
    private notifierService : NotifierService) {}

  ngOnInit(): void {
    this.vacation = this.data.vacation;
    this.calendarDaysLimit = moment(this.vacation.dateTo).diff(moment(this.vacation.dateFrom), "days") + 1;
    this.workingDaysLimit = this.countWorkingDays(this.vacation.dateFrom, this.vacation.dateTo);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  saveVacationTransfer() {
    if (this.transferredCalendarDays > this.calendarDaysLimit) {
      this.notifierService.notify("error", "Вы превысили лимит календарных дней!");
    } else if (this.transferredWorkingDays > this.workingDaysLimit) {
      this.notifierService.notify("error", "Вы превысили лимит рабочих дней!");
    } else {

      let vacationTransfer : VacationTransfer = new VacationTransfer(this.vacation.id);
      vacationTransfer.vacationTransferPeriodList = this.vacationTransferPeriods;

      this.vacationService.saveTransferredVacations(vacationTransfer).subscribe(response => {
        console.log(response);
        this.dialogRef.close();
        this.notifierService.notify("success", "Запрошен перенос дат!")
      }, error => {
        console.log(error);
        this.notifierService.notify("error", "Произошла ошибка!")
      });
    }
  }

  addNewVacationTransferPeriod() {
    let newVacationTransferPeriod = new VacationTransferPeriod("","");
    this.vacationTransferPeriods.push(newVacationTransferPeriod);
    console.log(this.vacationTransferPeriods);
  }

  private countWorkingDays(dateFrom: string, dateTo: string) {
    let counter = moment(dateTo).diff(dateFrom, "days") + 1;
    let count = 0;
    let date = moment(dateFrom);

    for (let i = 0; i < counter; i++) {
      date.add(1, 'days');
      console.log(date.isoWeekday() !== 6 && date.isoWeekday() !== 7);
      if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
        count += 1;
        console.log(count);
      }
    }

    return count;
  }

  valueChanged(dateFrom: any, dateTo: any) {
    // console.log(dateFrom.format("YYYY-MM-DD"), dateTo);
    this.transferredWorkingDays += this.countWorkingDays(dateFrom.format("YYYY-MM-DD"), dateTo.format("YYYY-MM-DD"));
    this.transferredCalendarDays += dateTo.diff(dateFrom, 'days') + 1;
  }
}
