import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayElement = false;

  constructor(private authService : AuthService,
              private router : Router,
              private notifierService : NotifierService,
              private userService : UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.getUser();
    }
  }

  ngDoCheck() : void {
    if (localStorage.getItem('token') != null) {
      // this.getUser();
      this.displayElement = true;
    } else {
      this.displayElement = false;
    }
  }

  currentUser : User = new User("", "", "", "", "", "", 0, 0, "", "", []);

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.notifierService.notify('success', 'Вы вышли из системы!')
    this.router.navigateByUrl('/login');
  }

  toAccount() {
    this.router.navigateByUrl('/my-account');
  }

  toVacations() {
    this.router.navigateByUrl('/vacations');
  }

  getUser() {
    this.userService.getUser().subscribe(
      response => {
        this.currentUser = response;
      }, error => {
        if (error.error == "Token is expired!") {
          this.notifierService.notify('error', 'Время действия сессии истекло, войдите заново!');
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

}
