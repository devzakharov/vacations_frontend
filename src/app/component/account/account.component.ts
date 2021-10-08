import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/User";
import {NotifierService} from "angular-notifier";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {DepartmentService} from "../../service/department/department.service";
import {AccountService} from "../../service/account/account.service";
import {HeaderService} from "../../service/header/header.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUser : User = new User(0,"", "", "", "", "", "", 0, 0, "", "", [], "", []);
  form: FormGroup;
  disableSelect = new FormControl(true);
  constructor(
    private authService : AuthService,
    private router : Router,
    private userService : UserService,
    private notifierService : NotifierService,
    private fb : FormBuilder,
    public organisationService : OrganisationService,
    public departmentService : DepartmentService,
    private accountService : AccountService,
    private headerService : HeaderService
  ) {
      this.form = this.fb.group({
        username: [{value: '', disabled: true}],
        password: [''],
        password_check: [''],
        first_name: [{value: '', disabled: true}],
        last_name: [{value: '', disabled: true}],
        middle_name: [{value: '', disabled: true}],
        email: [{value: '', disabled: false},Validators.email],
        position: [{value: '', disabled: true}],
      });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
    }

    this.getUser();
    this.organisationService.setOrganisationArray();
    this.departmentService.setDepartmentArray();
  }

  getUser() {
    this.userService.getUser().subscribe(response => {
      this.currentUser = response;
      if (this.checkAdminRole(this.currentUser)) {
        this.changeFormAccessibility();
      }
    }, error => {
      if (error.error == "Token is expired!") {
        this.notifierService.notify('error', 'Время действия сессии истекло, войдите заново!');
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
    })
  }

  saveUser() {
    if (this.comparePasswords() && this.emailValidation()) {

      this.fillUserObjectFromFormFields();
      this.headerService.getRolesArray(localStorage.getItem('token'));
      // console.log(this.headerService.currentUserRoles);

      if (this.headerService.currentUserRoles.some(val => val === "ROLE_ADMIN")) {

        this.accountService.saveUserByAdmin(this.currentUser).subscribe(response => {
            this.notifierService.notify('success', 'Данные сохранены!');
            this.getUser();
          }, error => {
            console.log(error);
            this.notifierService.notify('error', 'Произошла ошибка сохранения! ' + error.error.message);
          });

      } else if (this.headerService.currentUserRoles.some(val => val === "ROLE_USER")) {

        this.accountService.saveUserBySelf(this.currentUser).subscribe(response => {
          this.notifierService.notify('success', 'Данные сохранены!');
          this.getUser();
        }, error => {
          console.log(error);
          this.notifierService.notify('error', 'Произошла ошибка сохранения! ' + error.error.message);
        });

      }
    }
    console.log(this.form);
    console.log(this.currentUser);
  }

  fillUserObjectFromFormFields() {

    if (this.form.value.password != "") {
      this.currentUser.password = this.form.value.password;
    }

    // if (this.form.value.username != "") {
    //   this.currentUser.username = this.form.value.username;
    // }

    if (this.form.value.first_name != "") {
      this.currentUser.firstName = this.form.value.first_name;
    }

    if (this.form.value.last_name != "") {
      this.currentUser.lastName = this.form.value.last_name;
    }

    if (this.form.value.middle_name != "") {
      this.currentUser.middleName = this.form.value.middle_name;
    }

    if (this.form.value.position != "") {
      this.currentUser.position = this.form.value.position;
    }

    if (this.form.value.email != "") {
      this.currentUser.email = this.form.value.email;
    }

    console.log(this.currentUser);

  }

  comparePasswords() {
    if (this.form.value.password === this.form.value.password_check) {
      return true;
    } else {
      this.form.controls['password'].setErrors({'incorrect': true});
      this.form.controls['password_check'].setErrors({'incorrect': true});
      this.notifierService.notify('error', 'Введенные пароли не совпадают!');
      return false;
    }
  }

  emailValidation() {
    console.log(this.form.controls['email']);
    if (this.form.controls['email'].status === 'VALID') {
      return true;
    } else {
      this.notifierService.notify('error', 'Почта недействительна!');
      return false;
    }
  }

  checkAdminRole(user : User) {
    return user.roles.some(role => role.name === 'ROLE_ADMIN');
  }

  changeFormAccessibility() {
    this.form = this.fb.group({
      username: [{value: '', disabled: true}],
      password: [''],
      password_check: [''],
      first_name: [{value: '', disabled: false}],
      last_name: [{value: '', disabled: false}],
      middle_name: [{value: '', disabled: false}],
      email: [{value: '', disabled: false},Validators.email],
      position: [{value: '', disabled: false}],
    });

    this.disableSelect = new FormControl(false);
  }

  setOrganisationValue(e : any) {
    this.form.value.organisation = e.value;
    this.departmentService.getDepartmentsArrayByOrganisationId(e.value);
    this.currentUser.organisationId = e.value;
  }

  setDepartmentValue(e : any) {
    this.form.value.department = e.value;
    this.currentUser.departmentId = e.value;
  }

}
