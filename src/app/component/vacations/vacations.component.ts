import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {VacationService} from "../../service/vacation/vacation.service";
import {Vacation} from "../../model/Vacation";
import {NotifierService} from "angular-notifier";
import {Moment} from "moment/moment"
import * as moment from 'moment/moment';
import 'moment/locale/ru'
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ConditionService} from "../../service/conditions/condition.service";
import {HeaderService} from "../../service/header/header.service";
import {UserService} from "../../service/user/user.service";
import {NotificationService} from "../../service/notification/notification.service";
import {NotificationToSend} from "../../model/NotificationToSend";
import {UploadFileDialogComponent} from "../upload-file-dialog/upload-file-dialog.component";
import {VacationUserEditDialogComponent} from "../vacation-user-edit-dialog/vacation-user-edit-dialog.component";

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css']
})
export class VacationsComponent implements OnInit {

  constructor(private authService : AuthService,
              private router : Router,
              public vacationService : VacationService,
              private notifier : NotifierService,
              public dialog : MatDialog,
              public conditionService : ConditionService,
              private headerService : HeaderService,
              private userService : UserService,
              private notificationService : NotificationService
  ) { }

  vacationPeriods: string[] = [];

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
    } else {

      this.getVacationPeriods();
      this.conditionService.refreshDistributedDays();
      this.conditionService.refreshDistributedWorkingDays();
      this.conditionService.twoWeeksVacationCheck();
      this.conditionService.setConditionsFlag();

      this.vacationService.getAllCommonVacationsForCurrentPeriod().subscribe(
        (response) => {
          this.vacationService.currentPeriodVacations = [];
          response.forEach(vacation => {
            this.vacationService.currentPeriodVacations.push(vacation);
          });
        }, error => {
          console.log(error);
          this.notifier.notify('error', error.error.error + " " + error.error.message);
          if (error.error == "Token is expired!") {
            this.notifier.notify('error', 'Время действия сессии истекло, войдите заново!');
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      );

      this.vacationService.getAllCommonVacations().subscribe(
        (response) => {
          this.vacationService.commonVacations = [];
          response.forEach(vacation => {
            this.vacationService.commonVacations.push(vacation);
          });
        }, error => {
          console.log(error);
          this.notifier.notify('error', error.error.error + " " + error.error.message);
          if (error.error == "Token is expired!") {
            this.notifier.notify('error', 'Время действия сессии истекло, войдите заново!');
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      );

      this.vacationService.getAllUncommonVacations().subscribe(
        (response) => {
          // this.notifier.notify('success', 'Отсутствия загруженны!');
          this.vacationService.uncommonVacations = [];
          response.forEach(vacation => {
            this.vacationService.uncommonVacations.push(vacation);
          });
        }, error => {
          this.notifier.notify('error', error.error.error + " " + error.error.message);
          if (error.error == "Token is expired!") {
            this.notifier.notify('error', 'Время действия сессии истекло, войдите заново!');
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      );

      this.userService.getUser().subscribe(response => {
        if (response.vacationsApproval == 'APPROVED') {
          this.blockUserChanges();
        } else if (response.vacationsApproval == 'NOT_APPROVED') {
          this.unblockUserChanges();
        }
      }, error => {
        console.log(error);
      });

      this.getDeadline();
      this.conditionService.refreshDistributedDays();
      this.conditionService.refreshDistributedWorkingDays();
    }
  }

  removeVacation(vacation : Vacation) {
    this.vacationService.removeVacation(vacation).subscribe((response) => {
      console.log(response);
      this.notifier.notify('success', 'Отпуск ' + vacation.dateFrom + ' - ' + vacation.dateTo + ' удален!');
      this.vacationService.commonVacations = [];
      this.vacationService.uncommonVacations = [];
      this.ngOnInit();
    }, (error) => {
      this.notifier.notify('error', error.error.error + " " + error.error.message);
      if (error.error == "Token is expired!") {
        this.notifier.notify('error', 'Время действия сессии истекло, войдите заново!');
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
    });
  }

  getDeadline() {
    this.vacationService.getDeadline().subscribe(
      response => {
        this.conditionService.deadline = moment(response).format('DD.MM.YYYY');
      },
      error => {
        console.log(error)
      }
    );
  }

  getVacationPeriods() {
    this.vacationService.getVacationPeriods().subscribe(
      response => {
        this.convertPeriodsToMonths(response);
      }, error => {
        console.log(error)
      }
    );
  }

  private convertPeriodsToMonths(periods : string[]) {
    for (let i = 0; i < periods.length; i++) {
      let str : any[] = [];
      periods[i].split(',').forEach(month => {
        str.push(moment(month, 'MM').format('MMMM'));
      });
      this.vacationPeriods[i] = str.join(', ');
    }
  }


  openDialog(data : string) {
    this.dialog.open(AddVacationDialog, {
      data: {
        months : this.convertStringToMoments(data)
      },
      width : '300px'
    });
  }



  convertStringToMoments(data : string) : Moment[] {
    let momentArr : any[] = [];
    data.split(', ').forEach(
      month => {
        momentArr.push(moment().month(month).format('M'));
      }
    );
    return momentArr;
  }

  userConfirmVacations() {

    this.vacationService.getAllCommonVacations().subscribe(response => {
      if (response.some(vacation => {
          return vacation.departmentHeadApproval === 'APPROVED';
        }
      )) {
        this.notifier.notify('error', 'Вы уже отправили свой график на утверждение!')
      } else {
        if (this.conditionService.checkConditions()) {
          this.vacationService.userConfirmVacations().subscribe(
            response => {

              this.headerService.currentUser.vacationsApproval = response.vacationsApproval;

              this.blockUserChanges();

              let notification = new NotificationToSend(
                'USER_SEND_VACATIONS_TO_DEPARTMENT_HEAD_APPROVAL',
                this.headerService.currentUser.id
              );

              this.notificationService.sendNotification(notification).subscribe(response => {
                console.log(response);
              }, error => {
                console.log(error);
              });

              this.notifier.notify('success', 'График отпусков отправлен на утверждение руководителю отдела.')
            },
            error => {
              this.notifier.notify('error', error.error.message);
            });
        } else {
          this.notifier.notify('error', 'Не выполнены условия заполнения отпусков!');
        }
      }
    }, error => {
      console.log(error);
    });
  }

  userConfirmationRollBack() {
    this.vacationService.getAllCommonVacations().subscribe(response => {
      if (response.some(vacation => {
        return vacation.departmentHeadApproval === 'APPROVED';
      }
        )) {
        this.notifier.notify('error', 'Вы не можете скорректировать график! Начальник отдела уже утвердил Ваш график отпусков.')
      } else {
        this.vacationService.userConfirmationRollBack().subscribe(
          response => {
            this.headerService.currentUser.vacationsApproval = response.vacationsApproval;
            this.unblockUserChanges();
          }, error => {
            console.log(error)
          }
        )
      }
    }, error => {
      console.log(error);
    });
  }

  blockUserChanges () {
    this.vacationService.blockChanges = true;
  }

  unblockUserChanges () {
    this.vacationService.getDeadline().subscribe(response => {
      if (moment().diff(moment(response, 'YYYY-MM-DD'), 'days') < 0) {
        this.vacationService.blockChanges = false;
      } else {
        // console.log(response);
        // console.log(moment(response, 'YYYY-MM-DD'));
        // console.log(moment().diff(moment(response, 'YYYY-MM-DD'), 'days') < 0);
        // console.log(moment().diff(moment(response, 'YYYY-MM-DD'), 'days'));
        // console.log(moment());
        this.notifier.notify('warning', 'Вы просрочили крайнюю дату заполнения графика, обратитесь к руководителю отдела!');
      }
    }, error => {
      console.error(error);
    })
  }

  showWarningOnClick () {
    if (this.headerService.currentUser.vacationsApproval === 'APPROVED') {
      this.notifier.notify('warning', 'Вы отправили свой график на утверждение руководителю и не можете вносить в него изменения!');
    }
    if (this.headerService.currentUser.vacationsApproval === 'NOT_APPROVED') {
      this.notifier.notify('warning', 'Вы просрочили крайнюю дату заполнения графика, обратитесь к руководителю отдела!');
    }
  }

  downloadDocxFile(vacation: any) {
    console.log(vacation);
    if (vacation != null) {

      let link = btoa(vacation.vacationStatement.statementPath.substring(1));

      this.vacationService.getFile(link).subscribe(response => {
        let blob = new Blob([response], { type: 'application/octet-stream' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "statement.docx";
        link.click();
      }, error => {
        console.log(error);
      })
    }
  }

  downloadImageFile(vacation: any) {
    console.log(vacation);
    if (vacation != null) {

      let link = btoa(vacation.vacationStatement.signedStatementPath.substring(1));

      this.vacationService.getFile(link).subscribe(response => {
        let blob = new Blob([response], { type: 'application/octet-stream' });

        // let link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = "scan.jpg";
        // link.target = "_blank"
        // link.click();
        // console.log(link);

        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          let base64data = reader.result;
          // console.log(base64data);

          let image = new Image();
          if (typeof base64data === "string") {
            image.src = base64data;
          }
          // image.src = "data:image/jpg;base64," + base64data;

          let w = window.open("");
          // @ts-ignore
          w.document.write(image.outerHTML);
        }
      }, error => {
        console.log(error);
      })
    }
  }

  uploadFileDialog(vacation: any) {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      data: {
        vacation : vacation,
        fileType : 'statement'
      },
      width : '300px'
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  editVacation(vacation: Vacation) {
    const dialogRef = this.dialog.open(VacationUserEditDialogComponent, {
      data: {
        vacation : vacation,
      },
      width : '450px'
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  moreThanTwoWeeksBeforeVacation(vacation: Vacation) {
    return moment(vacation.dateFrom).diff(moment(), 'days') + 1 >= 15;
  }

  isTwoWeeksVacation(vacation: Vacation) {
    return moment(vacation.dateTo).diff(moment(vacation.dateFrom), 'days') + 1 >= 10;
  }
}

export interface DialogData {
  months : any[];
}

@Component({
  selector: 'add-vacation-dialog',
  templateUrl: 'add-vacation-dialog.html',
})
export class AddVacationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private fb : FormBuilder,
              private vacationService : VacationService,
              private notifierService : NotifierService,
              private conditionService : ConditionService) {
    this.addVacationForm = this.fb.group({
      message: [{value: 'Стандартный отпуск', disabled: false}],
      start: [{}],
      end: [{}]
    });
  }

  nowDate = moment();
  y = this.nowDate.format('YYYY');
  m = this.nowDate.format('M');
  d = this.nowDate.format('D');
  startDate = moment().add(1, "year");
  addVacationForm: FormGroup;
  vacationForSave : Vacation = new Vacation(0, '', '', '', 'COMMON', 0, 'NOT_APPROVED', false);

  monthFilter = (m: Moment | null): boolean => {
    const month = m?.format('M');
    // console.log(month);
    if (month) return this.data.months.includes((month).toString());
    return false;
  }

  saveVacation() {
    this.convertFormDataToVacation();
    this.vacationService.saveVacation(this.vacationForSave).subscribe(
      response => {
        this.vacationService.commonVacations.push(response);
        this.conditionService.refreshDistributedDays();
        this.conditionService.refreshDistributedWorkingDays();
        this.conditionService.twoWeeksVacationCheck();
        this.conditionService.setConditionsFlag();
      },
      error => {
        console.log(error);
        this.notifierService.notify('error', error.error.message);
        this.conditionService.setConditionsFlag();
        if (error.error.message === 'User days limit exceeded') {
          this.notifierService.notify('error', 'Превышен лимит дней!')
          this.conditionService.setConditionsFlag();
        }
        if (error.error.message === 'Vacations ranges is crossing') {
          this.notifierService.notify('error', 'Введенный отпуск пересекается по датам с другим вашим отпуском!')
          this.conditionService.setConditionsFlag();
        }
      }
    );
  }

  private convertFormDataToVacation() {
    if (this.addVacationForm.status === 'INVALID') {
      this.notifierService.notify('error', 'Форма заполнена некорректно!');
    }
    this.vacationForSave.dateFrom = this.addVacationForm.value.start;
    this.vacationForSave.dateTo = this.addVacationForm.value.end;
    this.vacationForSave.message = this.addVacationForm.value.message;
  }


}
