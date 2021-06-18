import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import {Organisation} from "../../model/Organisation";


@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  constructor(private http : HttpClient) {
  }

  organisationsArray : Organisation[] = [];

  getOrganisationArray() {
    return this.http.get<Organisation[]>( globals.server + '/api/v1/organisations/all');
  }

  setOrganisationArray() {
    this.getOrganisationArray().subscribe(response => {
      this.organisationsArray = response;
      console.log(response);
      console.log(this.organisationsArray);
    }, error => {
      console.log(error);
    });
  }
}
