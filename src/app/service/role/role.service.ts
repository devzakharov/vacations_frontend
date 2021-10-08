import { Injectable } from '@angular/core';
import {Role} from "../../type/Role";
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http : HttpClient) { }

  getAllRoles() {
    return this.http.get<Role[]>(globals.server + '/api/v1/roles/all');
  }

}
