import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HRUser} from "../../model/HRUser";
import {VacationService} from "../../service/vacation/vacation.service";
import {NotificationService} from "../../service/notification/notification.service";
import {HeaderService} from "../../service/header/header.service";
import {Vacation} from "../../model/Vacation";
import {NotificationToSend} from "../../model/NotificationToSend";

@Component({
  selector: 'app-vacation-edit-dialog',
  templateUrl: './vacation-edit-dialog.component.html',
  styleUrls: ['./vacation-edit-dialog.component.css']
})
export class VacationEditDialogComponent implements OnInit {

  vacation : Vacation | undefined;

  constructor(
    public dialogRef: MatDialogRef<VacationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vacationService : VacationService,
    private notificationService : NotificationService,
    private headerService : HeaderService) {}

  ngOnInit(): void {
    this.vacation = this.data.vacation;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  saveVacation() {
    if (this.vacation) this.vacationService.editVacation(this.vacation).subscribe(
      response => {
        console.log(response);

        let notification = new NotificationToSend(
          'VACATIONS_MASTER_EDIT_VACATION',
          this.headerService.currentUser.id,
          this.data.vacation.userId
        );

        this.notificationService.sendNotification(notification).subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        });

        this.dialogRef.close();
      },
      error => {
        console.log(error);
      }
    );
  }
}
