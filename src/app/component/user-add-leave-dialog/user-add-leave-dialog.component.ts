import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';
import {HRUser} from "../../model/HRUser";
import {Vacation} from "../../model/Vacation";
import {VacationService} from "../../service/vacation/vacation.service";

@Component({
  selector: 'app-user-add-leave-dialog',
  templateUrl: './user-add-leave-dialog.component.html',
  styleUrls: ['./user-add-leave-dialog.component.css']
})
export class UserAddLeaveDialogComponent implements OnInit {

  vacation : Vacation | undefined;
  vacationTypes : any[] = [];

  constructor(
    public dialogRef: MatDialogRef<UserAddLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HRUser,
    private vacationService : VacationService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.vacation = {
      id : 0,
      message : '',
      // @ts-ignore
      dateFrom : new Date(),
      // @ts-ignore
      dateTo : new Date(),
      userId : this.data.id,
      vacationType : '',
      departmentHeadApproval : 'NOT_APPROVED'
    };

    this.getVacationTypes();
  }

  setVacationType($event : any) {
    console.log($event);
    console.log(this.vacationTypes);
    if (this.vacation) this.vacation.vacationType = $event.value;
    if (this.vacation) {
      let index = this.vacationTypes.findIndex(type => type.name === $event.value);
      this.vacation.message = this.vacationTypes[index].displayName;
    }
    console.log(this.vacation);
  }

  getVacationTypes() {
    this.vacationService.getVacationTypes().subscribe(
      response => {
        this.vacationTypes = response;
        console.log(response);
      },
      error => {
        console.log(error);
      })
  }

  saveVacation() {
    if (this.vacation) this.vacationService.saveVacation(this.vacation).subscribe(
      response => {
        console.log(response);
        if (this.data.vacations === null) this.data.vacations = [];
        this.data.vacations.push(response);
        this.dialogRef.close();
      },
      error => {
        console.log(error);
      }
    );
  }
}
