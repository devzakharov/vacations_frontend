import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import {Organisation} from "../../model/Organisation";
import {DepartmentService} from "../department/department.service";
import {Department} from "../../model/Department";
import {HRDepartment} from "../../model/HRDepartment";


@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  constructor(private http : HttpClient,
              private departmentService : DepartmentService) {
  }

  organisationsArray : Organisation[] = [];

  getOrganisationArray() {
    return this.http.get<Organisation[]>( globals.server + '/api/v1/organisations/all');
  }

  setOrganisationArray() {
    this.getOrganisationArray().subscribe(response => {
      this.organisationsArray = response;
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getUsersGroupingByDepartments(organisationId : number) {
    return this.http.get<HRDepartment[]>(globals.server + '/api/v1/organisations/organisation?id=' + organisationId);
  }

}
