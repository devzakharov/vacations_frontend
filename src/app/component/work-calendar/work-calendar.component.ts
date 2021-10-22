import { Component, OnInit } from '@angular/core';
import {WorkCalendarService} from "../../service/work-calendar/work-calendar.service";
import {NotifierService} from "angular-notifier";
import {FormControl} from "@angular/forms";
import {RestDay} from "../../model/RestDay";
import * as moment from 'moment';


@Component({
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  styleUrls: ['./work-calendar.component.css']
})
export class WorkCalendarComponent implements OnInit {

  date = new FormControl();
  now : Date = new Date();
  startDate : Date = new Date(this.now.setFullYear(this.now.getFullYear() + 1));
  cYear : any;
  nYear : any;

  constructor(public workCalendarService : WorkCalendarService,
              private notifierService : NotifierService) { }

  ngOnInit(): void {
    this.cYear = this.currentYear();
    this.nYear = this.nextYear();
    this.loadDates();
  }

  loadDates() {
    this.workCalendarService.loadDates().subscribe(response => {
      this.workCalendarService.dates = response;
    }, error => {
      console.log(error);
    });
  }

  addDate() {

    if (this.workCalendarService.dates.filter((el : RestDay) => el.date === this.stringifyMoment(this.date.value)).length > 0) {

      this.notifierService.notify('error', 'Такая дата уже есть в списке!');

    } else {

      let restDay = new RestDay(0, moment(this.date.value).format('yyyy-MM-DD'), 'ACTIVE');

      this.workCalendarService.saveDate(restDay).subscribe(response => {
        this.notifierService.notify('success', 'Дата записанна!');
        this.ngOnInit();
      }, error => {
        this.notifierService.notify('error', 'Произошла ошибка при сохранении даты!');
        console.log(error);
      });

    }
  }

  getRestDays() {
    console.count("getRestDays invocation");
    return this.workCalendarService.dates;
  }

  removeDate(restDay : RestDay) {
    this.workCalendarService.removeDate(restDay).subscribe(response => {
      this.notifierService.notify('success', 'Дата успешно удалена!');
      this.ngOnInit();
    }, error => {
      console.log(error);
    })
  }

  currentYear() {
    return new Date().getFullYear();
  }

  nextYear() {
    return new Date().getFullYear() + 1;
  }

  stringifyMoment(date : Date) {
    return moment(date).format('DD.MM.YYYY').toString();
  }

  getYear(date: string) {
    console.log(date);
    return new Date(date).getFullYear();
  }

  cutStringDateToYear(string : string) {
    let index = string.lastIndexOf('.');
    let result = string.substring(index + 1, string.length);
    // console.log(result);
    return parseInt(result);
  }
}
