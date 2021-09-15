import { Injectable } from '@angular/core';
import {Vacation} from "../../model/Vacation";
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import { Moment } from 'moment';
import {User} from "../../model/User";



@Injectable({
  providedIn: 'root'
})
export class VacationService {

  public commonVacations : Vacation[] = [];
  public uncommonVacations : Vacation[] = [];

  blockChanges = false;

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

  userConfirmVacations() {
    return this.http.put<User>(globals.server + '/api/v1/vacations/approve', {'vacation_approval' : 'APPROVED'});
  }

  userConfirmationRollBack() {
    return this.http.put<User>(globals.server + '/api/v1/vacations/rollback', {'vacation_approval' : 'NOT_APPROVED'});
  }

  approveUserVacations(user: any) {
    return this.http.post<User>(globals.server + '/api/v1/vacations/department-head-approval', user);
  }

  vacationTypeToEmoji (vacation: Vacation) {
    if (vacation.vacationType === 'COMMON') return "🌴";
    if (vacation.vacationType === 'SICK_LEAVE') return "🤒";
    if (vacation.vacationType === 'UNPAID_LEAVE') return "🚶";
    if (vacation.vacationType === 'MATERNITY_LEAVE') return "👶";
    if (vacation.vacationType === 'LEAVE_DAY') return "😎";
    if (vacation.vacationType === 'BUSINESS_TRIP') return "💼";
    return vacation.vacationType;
  }

  getVacationTypes() {
    return this.http.get<any[]>(globals.server + '/api/v1/vacations/vacation-types');
  }

  disapproveUserVacations(user: any) {
    return this.http.post<User>(globals.server + '/api/v1/vacations/department-head-disapproval', user);
  }
}
