import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import {Department} from "../../model/Department";
import {User} from "../../model/User";
import {Vacation} from "../../model/Vacation";
import {HRDepartment} from "../../model/HRDepartment";

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
      // console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getDepartmentsArrayByOrganisationId(id : number) {
    return this.http.get<Department[]>( globals.server + '/api/v1/departments/all-by-organisation?organisation=' + id).subscribe(
      response => {
        this.departmentsArray = response;
        console.log(response, id);
      }, error => {
        console.log(error);
      }
    );
  }

  getUserListByDepartmentId(id : number) {
    return this.http.get<User[]>(globals.server + '/api/v1/users/users-by-department-id?department=' + id);
  }

  approveUserVacations(vacationArray : Vacation[]) {
    return this.http.post(globals.server + '/api/v1/vacations/approve-vacations', vacationArray);
  }

  deleteDepartment(department : HRDepartment) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: department
    };

    return this.http.delete(globals.server + '/api/v1/departments/delete', options);
  }

  addDepartment(department : any) {
    return this.http.put<any>(globals.server + '/api/v1/departments/add', department);
  }
}
