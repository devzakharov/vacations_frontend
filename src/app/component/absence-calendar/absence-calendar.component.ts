import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {HROrganisation} from "../../model/HROrganisation";
import {UserService} from "../../service/user/user.service";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {HRDepartment} from "../../model/HRDepartment";
import {HRUser} from "../../model/HRUser";
import {MatTable} from "@angular/material/table";
import {Vacation} from "../../model/Vacation";

const DEPARTMENT_DATA: HRDepartment[] = [];
let USER_DATA : HRUser[] = []
let SAUSAGES : Vacation[] = [];

@Component({
  selector: 'app-absence-calendar',
  templateUrl: './absence-calendar.component.html',
  styleUrls: ['./absence-calendar.component.css']
})
export class AbsenceCalendarComponent implements OnInit {

  cellWidth: number = 0;
  cellHeight: number = 0;
  employeeCellWidth : number = 240;

  currentDate : moment.Moment = moment();
  currentMonthDates : any[] | undefined = this.fillDaysArray(this.currentDate);

  displayedColumns: string[] = ['name'];
  dataSource = USER_DATA;

  organisation : HROrganisation | undefined;

  constructor(private userService : UserService,
              private organisationService : OrganisationService) { }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<HRUser>;

  ngOnInit(): void {
    this.getDataForComponent();
    this.fillDaysArray(this.currentDate);
    this.renderColumns();
  }

  fillDaysArray(currentDate : moment.Moment) {
   return new Array(currentDate.daysInMonth())
     .fill(null)
     .map((x, i) => currentDate.clone().startOf('month').add(i, 'days'));
  }

  prevMonth() {
    this.currentDate = moment(this.currentDate).add(-1, 'month');
    this.currentMonthDates = this.fillDaysArray(this.currentDate);
    this.renderColumns();
  }

  nextMonth() {
    this.currentDate = moment(this.currentDate).add(1, 'month');
    this.currentMonthDates = this.fillDaysArray(this.currentDate);
    this.renderColumns();
  }

  getDataForComponent() {
    this.userService.getUser().subscribe(
      response => {
        this.organisationService.getUsersGroupingByDepartments(response.organisationId).subscribe(response => {

          DEPARTMENT_DATA.length = 0;
          USER_DATA.length = 0;
          SAUSAGES.length = 0;

          this.organisation = response;
          response.departments.forEach(department => {
            DEPARTMENT_DATA.push(department);
          })

          this.fillUserData();

          this.table.renderRows();

          this.calculateCellDimensions();

        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      }
    );
  }

  fillUserData() {
    DEPARTMENT_DATA.forEach(department => {
      USER_DATA.push(...department.users);
    });
    USER_DATA.forEach(user => {
      if (user.vacations)
      SAUSAGES.push(...user.vacations);
    });
    console.log(SAUSAGES);
  }

  private renderColumns() {
    this.displayedColumns = []
    this.displayedColumns.push('name');
    if(this.currentMonthDates)
    this.currentMonthDates.forEach(date => {
      this.displayedColumns.push(date.format('DD.MM.YYYY'));
    })
    this.calculateCellDimensions();
  }

  calculateCellDimensions() {
    let cell = document.querySelector<any>('.absence-table-header-cell');
    //@ts-ignore
     if (cell) {
       this.cellWidth = cell.offsetWidth;
       this.cellHeight = cell.offsetHeight;

       console.log('width: ' + this.cellWidth + ' height: ' + this.cellHeight);
     }
  }

  renderSausages() {
    SAUSAGES.forEach(sausage => {
      const user = document.getElementById("user-row-id-" + sausage.userId);
      console.log(user);
      // const div = document.createElement('div');
      // div.classList.add('sausage');
      // user ? user.append(div) : null;
    });
  }
}
