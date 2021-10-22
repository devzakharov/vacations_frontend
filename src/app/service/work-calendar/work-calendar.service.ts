import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import {RestDay} from "../../model/RestDay";
import {Vacation} from "../../model/Vacation";

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarService {

  dates : RestDay[] = [];

  constructor(private http : HttpClient) { }

  loadDates() {
    return this.http.get<RestDay[]>(globals.server + '/api/v1/rest-days/all');
  }

  saveDate(restDay : RestDay) {
    return this.http.put<RestDay[]>(globals.server + '/api/v1/rest-days/save', restDay);
  }

  removeDate(restDay : RestDay) {
    return this.http.delete(globals.server + '/api/v1/rest-days/delete/' + restDay.id);
  }
}
