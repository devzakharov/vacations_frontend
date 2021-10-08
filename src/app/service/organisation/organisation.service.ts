import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as globals from "../../globals";
import {Organisation} from "../../model/Organisation";
import {DepartmentService} from "../department/department.service";
import {HROrganisation} from "../../model/HROrganisation";
import {User} from "../../model/User";
import {Role} from "../../model/Role";


@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  constructor(private http : HttpClient,
              private departmentService : DepartmentService) {
  }

  organisationsArray : Organisation[] = [];

  currentOrganisation : HROrganisation | undefined;
  accessibleOrganisations : Organisation[] = [];

  getOrganisationArray() {
    return this.http.get<Organisation[]>( globals.server + '/api/v1/organisations/all');
  }

  setOrganisationArray() {
    this.getOrganisationArray().subscribe(response => {
      this.organisationsArray = response;
      // console.log(response);
    }, error => {
      console.log(error);
    });
  }

  getUsersGroupingByDepartments(organisationId : number) {
    return this.http.get<HROrganisation>(globals.server + '/api/v1/organisations/organisation?id=' + organisationId);
  }

  hasDepartmentHeadRole(user: User) {
    return user.roles.some(role => {
      return role.displayName === Role.ROLE_DEPARTMENT_HEAD;
    });
  }

  addOrganisation(organisation : HROrganisation) {
    return this.http.post(globals.server + '/api/v1/organisations/add', organisation);
  }

  getHROrganisationArray() {
    return this.http.get<HROrganisation[]>( globals.server + '/api/v1/organisations/hr-all');
  }

  deleteOrganisation(organisation: HROrganisation) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: organisation
    };

    return this.http.delete<HROrganisation>(globals.server + '/api/v1/organisations/delete', options);
  }

  getHROrganisation(id: number) {
    return this.http.get<HROrganisation>(globals.server + '/api/v1/organisations/organisation?id=' + id);
  }
}
