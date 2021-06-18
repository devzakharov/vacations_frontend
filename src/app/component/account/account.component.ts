import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/User";
import {NotifierService} from "angular-notifier";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganisationService} from "../../service/organisation/organisation.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUser : User = new User("", "", "", "", "", "", 0, 0, "", "", []);
  form: FormGroup;

  constructor(
    private authService : AuthService,
    private router : Router,
    private userService : UserService,
    private notifierService : NotifierService,
    private fb : FormBuilder,
    public organisationService : OrganisationService
  ) {
      this.form = this.fb.group({
        username: [{value: '', disabled: true}],
        password: [''],
        password_check: [''],
        first_name: [{value: '', disabled: true}],
        last_name: [{value: '', disabled: true}],
        middle_name: [{value: '', disabled: true}],
        email: [{value: '', disabled: false},Validators.email],
        organisation: [{value: '', disabled: true}],
        department: [{value: '', disabled: true}],
        position: [{value: '', disabled: true}],
      });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
    }

    this.getUser();
    this.organisationService.setOrganisationArray();
    console.log('account component inited');
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
    //this.comparePasswords();
    //this.emailValidation();
    console.log(this.form);
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
      username: [{value: '', disabled: false}],
      password: [''],
      password_check: [''],
      first_name: [{value: '', disabled: false}],
      last_name: [{value: '', disabled: false}],
      middle_name: [{value: '', disabled: false}],
      email: [{value: '', disabled: false},Validators.email],
      organisation: [{value: '', disabled: false}],
      department: [{value: '', disabled: false}],
      position: [{value: '', disabled: false}],
    });
  }

  setOrganisationValue(e : any) {
    console.log(e.value);
    this.form.value.organisation = e.value;
  }

  setDepartmentValue(e : any) {
    console.log(e.value);
    this.form.value.department = e.value;
  }

  //если значение в форме пустое, берем значение из текущего пользователя, если значение новое - пишем новое в юзера для апдейта на беке

}
