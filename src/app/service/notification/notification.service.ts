import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import {UserNotification} from "../../model/UserNotification";
import {UserService} from "../user/user.service";
import {HeaderService} from "../header/header.service";
import {NotificationToSend} from "../../model/NotificationToSend";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http : HttpClient,
              private userService : UserService,
              private headerService : HeaderService) { }

  getNotifications() {
    return this.http.get<UserNotification[]>( globals.server + '/api/v1/notifications/user-notifications');
  }

  deleteNotification(notification : UserNotification) {
    return this.http.post<UserNotification>(globals.server + '/api/v1/notifications/delete', notification);
  }

  sendNotification(notification : NotificationToSend) {
    return this.http.post<UserNotification>(globals.server + '/api/v1/notifications/add', notification);
  }

}
