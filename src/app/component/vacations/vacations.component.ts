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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConditionService} from "../../service/conditions/condition.service";
import {HeaderService} from "../../service/header/header.service";
import {UserService} from "../../service/user/user.service";
import {NotificationService} from "../../service/notification/notification.service";
import {UserNotification} from "../../model/UserNotification";

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
      this.conditionService.twoWeeksVacationCheck();
      this.conditionService.setConditionsFlag();

      this.vacationService.getAllCommonVacations().subscribe(
        (response) => {
          // this.notifier.notify('success', 'Отпуска загруженны!');
          console.log(response);
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
    }
  }

  removeVacation(vacation : Vacation) {
    this.vacationService.removeVacation(vacation).subscribe((response) => {
      console.log(response);
      this.notifier.notify('success', 'Отпуск ' + vacation.date_from + ' - ' + vacation.date_to + ' удален!');
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
    // console.log(this.convertStringToMoments(data));
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
          return vacation.department_head_approval === 'APPROVED';
        }
      )) {
        this.notifier.notify('error', 'Вы уже отправили свой график на утверждение!')
      } else {
        if (this.conditionService.checkConditions()) {
          this.vacationService.userConfirmVacations().subscribe(
            response => {
              this.headerService.currentUser.vacationsApproval = response.vacationsApproval;
              this.blockUserChanges();
              this.notifier.notify('success', 'График отпусков отправлен на утверждение руководителю отдела.')

              let notification = new UserNotification(
                0,
                'Пользователь внес отпуска',
                this.notificationService.userSendVacationsForApproveMessage(),
                this.headerService.currentUser.id,
                0
              );

              console.log(notification);

              this.notificationService.sendNotification(notification).subscribe(response => {
                console.log(response);
              }, error => {
                console.log(error);
              });
            },
            error => {
              // console.log(error);
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
        return vacation.department_head_approval === 'APPROVED';
      }
        )) {
        // console.log('APPROVED');
        this.notifier.notify('error', 'Вы не можете скорректировать график! Начальник отдела уже утвердил Ваш график отпусков.')
      } else {
        // console.log('NOT_APPROVED');
        this.vacationService.userConfirmationRollBack().subscribe(
          response => {
            // console.log(response);
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
    if (moment().diff(moment(this.conditionService.deadline, 'DD.MM.YYYY'), 'days') < 0) {
      this.vacationService.blockChanges = false;
    } else {
      this.notifier.notify('warning', 'Вы просрочили крайнюю дату заполнения графика, обратитесь к руководителю отдела!');
    }
  }

  showWarningOnClick () {
    if (this.headerService.currentUser.vacationsApproval === 'APPROVED') {
      this.notifier.notify('warning', 'Вы отправили свой график на утверждение руководителю и не можете вносить в него изменения!');
    }
    if (this.headerService.currentUser.vacationsApproval === 'NOT_APPROVED') {
      this.notifier.notify('warning', 'Вы просрочили крайнюю дату заполнения графика, обратитесь к руководителю отдела!');
    }
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

  startDate = new Date();
  addVacationForm: FormGroup;
  vacationForSave : Vacation = new Vacation(0, '', '', '', 'COMMON', 0, '');

  monthFilter = (m: Date | null): boolean => {
    const month = (m || new Date()).getMonth();
    return this.data.months.includes((month + 1).toString());
  }

  saveVacation() {
    this.convertFormDataToVacation();
    this.vacationService.saveVacation(this.vacationForSave).subscribe(
      response => {
        this.vacationService.commonVacations.push(response);
        this.conditionService.refreshDistributedDays();
        this.conditionService.twoWeeksVacationCheck();
        this.conditionService.setConditionsFlag();
      },
      error => {
        console.log(error);
        this.notifierService.notify('error', error.error.message);
        if (error.error.message === 'User days limit exceeded') {
          this.notifierService.notify('error', 'Превышен лимит дней!')
        }
        if (error.error.message === 'Vacations ranges is crossing') {
          this.notifierService.notify('error', 'Введенный отпуск пересекается по датам с другим вашим отпуском!')
        }
      }
    );
  }

  private convertFormDataToVacation() {
    if (this.addVacationForm.status === 'INVALID') {
      this.notifierService.notify('error', 'Форма заполнена некорректно!');
    }
    console.log(this.addVacationForm);
    this.vacationForSave.date_from = this.addVacationForm.value.start;
    this.vacationForSave.date_to = this.addVacationForm.value.end;
    this.vacationForSave.message = this.addVacationForm.value.message;
  }
}
