import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/User";
import * as globals from "../../globals";
import {HRUser} from "../../model/HRUser";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  getUser() {
    return this.http.get<User>(globals.server + '/api/v1/users/current');
  }

  saveUser(user : HRUser) {
    return this.http.post<HRUser>(globals.server + '/api/v1/users/update', user);
  }
}
