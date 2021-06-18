import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import {UserNotification} from "../../model/UserNotification";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http : HttpClient) { }

  getNotifications() {
    return this.http.get<UserNotification[]>( globals.server + '/api/v1/notifications/user-notifications');
  }

  deleteNotification(notification : UserNotification) {
    return this.http.post<UserNotification>(globals.server + '/api/v1/notifications/delete', notification)
  }

}
