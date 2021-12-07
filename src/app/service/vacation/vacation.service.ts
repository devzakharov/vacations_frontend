import { Injectable } from '@angular/core';
import {Vacation} from "../../model/Vacation";
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import { Moment } from 'moment';
import {User} from "../../model/User";
import {VacationTransfer} from "../../model/VacationTransfer";



@Injectable({
  providedIn: 'root'
})
export class VacationService {

  public commonVacations : Vacation[] = [];
  public uncommonVacations : Vacation[] = [];
  public currentPeriodVacations : Vacation[] = [];

  blockChanges = false;

  constructor(private http : HttpClient) { }

  getAllCommonVacations() {
    return this.http.get<Vacation[]>(globals.server + '/api/v1/vacations/common');
  }

  getAllUncommonVacations() {
    return this.http.get<Vacation[]>(globals.server + '/api/v1/vacations/uncommon');
  }

  getAllCommonVacationsForCurrentPeriod() {
    return this.http.get<Vacation[]>(globals.server + '/api/v1/vacations/common/current-period')
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

  editVacation(body : Vacation) {
    return this.http.post<Vacation>(globals.server + '/api/v1/vacations/update', body);
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

  getDistributedWorkingDays() {
    return this.http.get<number>(globals.server + '/api/v1/vacations/distributed-working-days');
  }

  getFile(path : string) {
    return this.http.get<Blob>(globals.server + '/api/v1/files/' + path, {
      headers: new HttpHeaders({
        'Accept':'application/docx'
      }),
      'responseType': 'blob' as 'json'
    });
  }

  saveFile(formData : FormData) {
    return this.http.post(globals.server + '/api/v1/files', formData);
  }

  setVacationPayCalculated(vacation: any) {
    return this.http.post<Vacation>(globals.server + '/api/v1/vacations/vacation-pay-calculated', vacation);
  }

  saveTransferredVacations(vacationTransfer : VacationTransfer) {
    return this.http.put(globals.server + '/api/v1/vacation-transfer', vacationTransfer);
  }

  getVacationTransferList(id: number) {
    return this.http.get<VacationTransfer[]>(globals.server + '/api/v1/vacation-transfer/' + id);
  }

  getVacationById(vacationId: number) {
    return this.http.get<Vacation>(globals.server + '/api/v1/vacations/' + vacationId);
  }

  approveTransfer(transfer: any) {
    return this.http.post<VacationTransfer>(globals.server + '/api/v1/vacation-transfer', transfer);
  }

  rejectTransfer(transfer: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: transfer
    };

    return this.http.delete<VacationTransfer>(globals.server + '/api/v1/vacation-transfer', options);
  }
}
