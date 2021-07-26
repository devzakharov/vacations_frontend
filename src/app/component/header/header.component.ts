import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/User";
import {HeaderService} from "../../service/header/header.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService : AuthService,
              private router : Router,
              private notifierService : NotifierService,
              private userService : UserService,
              public headerService: HeaderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.headerService.displayHeader = true;
      this.headerService.getUser();
    }
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.notifierService.notify('success', 'Вы вышли из системы!')
    this.router.navigateByUrl('/login');
    this.headerService.changeVisibility();
  }

  toAccount() {
    this.router.navigateByUrl('/my-account');
  }

  toVacations() {
    this.router.navigateByUrl('/vacations');
  }


  toAllOrganisations() {
    this.router.navigateByUrl('/all-organisations');
  }

  toOrganisation() {
    this.router.navigateByUrl('/organisation');
  }

  toDepartment() {
    this.router.navigateByUrl('/department');
  }
}
