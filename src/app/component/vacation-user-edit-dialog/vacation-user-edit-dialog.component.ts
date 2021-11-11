import {Component, Inject, OnInit} from '@angular/core';
import {Vacation} from "../../model/Vacation";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VacationService} from "../../service/vacation/vacation.service";
import {NotificationService} from "../../service/notification/notification.service";
import {HeaderService} from "../../service/header/header.service";
import {NotificationToSend} from "../../model/NotificationToSend";

@Component({
  selector: 'app-vacation-user-edit-dialog',
  templateUrl: './vacation-user-edit-dialog.component.html',
  styleUrls: ['./vacation-user-edit-dialog.component.css']
})
export class VacationUserEditDialogComponent implements OnInit {

  //@ts-ignore
  oldVacation : Vacation;
  newVacations : Vacation[] = [];

  constructor(
    public dialogRef: MatDialogRef<VacationUserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vacationService : VacationService,
    private notificationService : NotificationService,
    private headerService : HeaderService) {}

  ngOnInit(): void {
    this.oldVacation = this.data.vacation;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  //сменить эндпоинт на апдейт отпуска
  saveVacations() {
    if (this.oldVacation) this.vacationService.editVacation(this.oldVacation).subscribe(
      response => {
        console.log(response);

        //поправить нотификацию
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

  addNewVacation() {
    let newVacation = new Vacation(0, '', '', 'Стандартный отпуск', 'COMMON', this.headerService.currentUser.id, 'NOT_APPROVED');
    this.newVacations.push(newVacation);
  }
}
