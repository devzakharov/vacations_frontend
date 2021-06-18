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
              public conditionService : ConditionService
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
          this.notifier.notify('success', 'Отпуска загруженны!');
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
          this.notifier.notify('success', 'Отсутствия загруженны!');
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

      this.getDeadline();
      this.conditionService.refreshDistributedDays();
    }
  }

  removeVacation(vacation : Vacation) {
    this.vacationService.removeVacation(vacation).subscribe((response) => {
      console.log(response);
      this.notifier.notify('success', 'Отсутствие ' + vacation.id + ' удалено!');
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
  vacationForSave : Vacation = new Vacation(0, '', '', '', 'COMMON', 0);

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
