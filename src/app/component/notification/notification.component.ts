import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../../service/notification/notification.service";
import {UserNotification} from "../../model/UserNotification";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  listVisibility = false;
  notificationsArray: UserNotification[] = [];
  lastSize : number = 0;
  interval : any;
  stopFlag: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private notifierService: NotifierService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshNotification();


    this.interval = setInterval(() => {
      if (!this.stopFlag) this.refreshNotification();
    }, 30000);
  }

  refreshNotification() {
    this.lastSize = this.notificationsArray.length;
    this.notificationsArray = [];
    this.notificationService.getNotifications().subscribe(response => {
      // console.log(response);
      response.forEach(notification => {
        this.notificationsArray.push(notification);
      })
      if (this.lastSize !== this.notificationsArray.length) {
        this.notifierService.notify('success', 'Есть непрочитанные оповещения!')
      }
    }, error => {
      if (error.error == "Token is expired!") {
        this.stopFlag = true;
        this.notifierService.notify('error', 'Время действия сессии истекло, войдите заново!');
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
      console.log(error);
      if (error.error.error == "Forbidden") {
        this.stopFlag = true;
      }
      // console.log("Something went wrong in NotificationComponent");
    })
  }

  deleteNotification(notification : UserNotification) {
    console.log(notification);

    this.notificationService.deleteNotification(notification).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })

    for(let i = 0; i < this.notificationsArray.length; i++){
      if (this.notificationsArray[i].id === notification.id) {
        this.notificationsArray.splice(i, 1);
      }
    }

    if (this.notificationsArray.length === 0) {
      this.listVisibility = false;
    }
  }

}
