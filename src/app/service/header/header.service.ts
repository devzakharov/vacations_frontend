import { Injectable } from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../user/user.service";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  displayHeader = false;
  currentUser : User = new User(0,"", "", "", "", "", "", 0, 0, "", "", [], "", [], "");
  currentUserRoles : string[] = [];

  constructor(private userService : UserService,
              private notifierService: NotifierService,
              private router: Router,
              private authService: AuthService) { }

  changeVisibility() {
    this.displayHeader = !this.displayHeader;
  }

  getUser() {
    this.userService.getUser().subscribe(
      response => {
        this.currentUser = response;
        this.getRolesArray(localStorage.getItem('token'));
      }, error => {
        if (error.error == "Token is expired!") {
          this.notifierService.notify('error', 'Время действия сессии истекло, войдите заново!');
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  getRolesArray(token : any) {
    let jwtData = token.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    // console.log('decodedJwtJsonData: ' + decodedJwtJsonData);
    // console.log('roles: ' + decodedJwtData.roles);

    this.currentUserRoles = decodedJwtData.roles;
  }

  isAdmin() {
    return this.currentUserRoles.includes('ROLE_ADMIN');
  }

  isPersonnelOfficer() {
    return this.currentUserRoles.includes('ROLE_PERSONNEL_OFFICER');
  }

  isGeneralManager() {
    return this.currentUserRoles.includes('ROLE_GENERAL_MANAGER');
  }

  isDepartmentHead() {
    return this.currentUserRoles.includes('ROLE_DEPARTMENT_HEAD');
  }

  isAccountant() {
    return this.currentUserRoles.includes('ROLE_ACCOUNTANT');
  }

  isGeneralDirector() {
    return this.currentUserRoles.includes('ROLE_GENERAL_DIRECTOR');
  }

  isVacationMaster() {
    return this.currentUserRoles.includes('ROLE_VACATIONS_MASTER');
  }
}
