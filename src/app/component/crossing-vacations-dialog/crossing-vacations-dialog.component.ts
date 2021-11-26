import {Component, Inject, OnInit} from '@angular/core';
import {OrganisationService} from "../../service/organisation/organisation.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HRUser} from "../../model/HRUser";
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";


@Component({
  selector: 'app-crossing-vacations-dialog',
  templateUrl: './crossing-vacations-dialog.component.html',
  styleUrls: ['./crossing-vacations-dialog.component.css']
})
export class CrossingVacationsDialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<CrossingVacationsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private http : HttpClient) { }

  crossedUsersAndVacations : any[] = [];
  users : any[] = [];
  vacations : any[] = [];

  ngOnInit(): void {
    this.getUsersWithCrossingVacations().subscribe(
      response => {
        //@ts-ignore
        this.crossedUsersAndVacations = response.crossedUsersAndVacations;
        //@ts-ignore
        this.users = response.usersList;
        //@ts-ignore
        this.vacations = response.vacationsList;
      }, error => {
        console.log(error);
      }
    );
  }

  onNoClick(): void {
    // console.log(this.data);
    this.dialogRef.close();
  }

  getUsersWithCrossingVacations() {
    return this.http.get(globals.server + '/api/v1/departments/' + this.data[0].departmentId);
  }

  findUsername(id: number) {
    if (this.users.length > 0) {
      // @ts-ignore
      let index : number = this.users.findIndex(user => user.id === id);
      console.log(index);
      let user : any = this.users[index];
      console.log(user);
      return user.firstName + " " + user.lastName;
    }
    return "";
  }

  findVacationPeriod(crossedVacationId: number) {
    if (this.vacations.length > 0) {
      // @ts-ignore
      let index : number = this.vacations.findIndex(vacation => vacation.id === crossedVacationId);
      let vacation : any = this.vacations[index];
      return vacation.dateFrom + " - " + vacation.dateTo;
    }
    return "";
  }
}
