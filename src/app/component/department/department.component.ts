import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/User";
import {DepartmentService} from "../../service/department/department.service";
import {UserService} from "../../service/user/user.service";
import {HeaderService} from "../../service/header/header.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import * as moment from 'moment';
import {VacationService} from "../../service/vacation/vacation.service";
import {Vacation} from "../../model/Vacation";
import {UserNotification} from "../../model/UserNotification";
import {NotificationService} from "../../service/notification/notification.service";

const ELEMENT_DATA: User[] = [];


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  constructor(private departmentService : DepartmentService,
              private userService : UserService,
              private headerService : HeaderService,
              private vacationService : VacationService,
              private notificationService : NotificationService) { }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<User>;

  ngOnInit(): void {
    this.userService.getUser().subscribe(response => {
      this.fillUserArray(response.departmentId);
    })
  }

  displayedColumns: string[] = ['demo-name', 'demo-position', 'demo-vacations', 'demo-approvals', 'demo-approve'];
  dataSource = ELEMENT_DATA;

  fillUserArray(departmentId : number) {

    console.log(this.headerService.currentUser.departmentId);

    ELEMENT_DATA.length = 0;

    this.departmentService.getUserListByDepartmentId(departmentId).subscribe(
      response => {
        console.log(response);
        response.forEach(user => {
          console.log(user);
          ELEMENT_DATA.push(user);
        });
        console.log(this.dataSource);
        this.table.renderRows();
      }, error => {
        console.log(error);
      }
    )
  }

  parseStringToDate(dateString: string) {
    return moment(dateString).format('DD.MM.YYYY');
  }

  approveUserVacations(user : any) {
    this.vacationService.approveUserVacations(user).subscribe(response => {

      // @ts-ignore
      ELEMENT_DATA.find(el => {return el.id === response.id}).vacations = response.vacations;

      //on success will provide notification for user and change buttons state, notify user about success

      let notification = new UserNotification(
        0,
        'Глава отдела утвердил график',
        this.notificationService.departmentHeadApproveVacationsMessage(),
        this.headerService.currentUser.id,
        user.id
      );

      this.notificationService.sendNotification(notification).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });

      console.log(notification);
      console.log(ELEMENT_DATA);
    }, error => {
      console.log(error);
      //error message
    });
  }
  disapproveUserVacations(user : any) {
    console.log(user);
  }

  isUserVacationsApprovedByHead(vacations : Vacation[]) {
    let found = vacations.some(function (el) {
      // @ts-ignore
      return el.departmentHeadApproval === 'NOT_APPROVED';
    });
    return !found;
  }
}
