import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import {Department} from "../../model/Department";
import {User} from "../../model/User";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http : HttpClient) {
  }

  departmentsArray : Department[] = [];

  getCurrentUserDepartmentsArray() {
    return this.http.get<Department[]>( globals.server + '/api/v1/departments/all-by-user-organisation');
  }

  setDepartmentArray() {
    this.getCurrentUserDepartmentsArray().subscribe(response => {
      this.departmentsArray = response;
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getDepartmentsArrayByOrganisationId(id : number) {
    return this.http.get<Department[]>( globals.server + '/api/v1/departments/all-by-organisation?organisation=' + id).subscribe(
      response => {
        this.departmentsArray = response;
        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }

  getUserListByDepartmentId(id : number) {
    return this.http.get<User[]>(globals.server + '/api/v1/users/users-by-department-id?department=' + id);
  }
}
