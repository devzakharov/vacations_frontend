import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth/auth.service";
import {NotifierService} from "angular-notifier";
import {HeaderService} from "../../service/header/header.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private router: Router,
              private readonly notifier: NotifierService,
              private headerService : HeaderService) {

    this.form = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    if (val.username && val.password) {
      val.username = val.username.trim();
      val.password = val.password.trim();
      this.authService.login(val.username, val.password)
        .subscribe(
          (response) => {
            this.notifier.notify('success', 'Вход выполнен!')
            this.authService.setSession(response);
            this.router.navigateByUrl('/vacations');
            this.headerService.getUser();
            this.headerService.changeVisibility();
          }, error => {
            if (error.error == "Token is expired!") {
              this.notifier.notify('error', 'Время действия сессии истекло, войдите заново!');
              this.authService.logout();
              this.login();
            }
            if (error.status == 403) {
              this.notifier.notify('error', 'Произошла ошибка, проверьте данные для входа!');
            }
          }
        );
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/vacations');
    }
  }

}
