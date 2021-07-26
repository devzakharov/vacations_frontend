import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/User";
import * as globals from "../../globals";
import {Department} from "../../model/Department";
import {NotifierService} from "angular-notifier";


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http : HttpClient,
              private notifierService : NotifierService) { }

  saveUser(user : User) {
    return this.http.post<User>( globals.server + '/api/v1/admin/users/update', user)
      .subscribe(response => {
        this.notifierService.notify('success', 'Данные сохранены!');
      }, error => {
        console.log(error);
        this.notifierService.notify('error', 'Произошла ошибка сохранения! ' + error.error.message);
      })
  }
}
