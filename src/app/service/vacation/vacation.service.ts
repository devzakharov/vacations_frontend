import { Injectable } from '@angular/core';
import {Vacation} from "../../model/Vacation";
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import { Moment } from 'moment';



@Injectable({
  providedIn: 'root'
})
export class VacationService {

  public commonVacations : Vacation[] = [];
  public uncommonVacations : Vacation[] = [];

  constructor(private http : HttpClient) { }

  getAllCommonVacations() {
    return this.http.get<Vacation[]>(globals.server + '/api/v1/vacations/common');
  }

  getAllUncommonVacations() {
    return this.http.get<Vacation[]>(globals.server + '/api/v1/vacations/uncommon');
  }

  removeVacation(vacation : Vacation) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: vacation
    };

    return this.http.delete(globals.server + '/api/v1/vacations/delete', options);
  }

  getDeadline() {
    return this.http.get<Moment>(globals.server + '/api/v1/vacations/deadline');
  }

  getAvailableDays() {

  }

  getVacationPeriods() {
    return this.http.get<string[]>(globals.server + '/api/v1/vacations/periods');
  }

  getDistributedDays() {
    return this.http.get<number>(globals.server + '/api/v1/vacations/distributed-days');
  }

  getMaxDaysInARow() {
    return this.http.get<number>(globals.server + '/api/v1/vacations/max-days-in-a-row');
  }

  saveVacation(body : Vacation) {
    return this.http.post<Vacation>(globals.server + '/api/v1/vacations/add', body);
  }
}
