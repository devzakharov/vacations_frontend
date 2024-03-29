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
import {NotifierService} from "angular-notifier";
import {NotificationToSend} from "../../model/NotificationToSend";
import {UserAddDialogComponent} from "../user-add-dialog/user-add-dialog.component";
import {CrossingVacationsDialogComponent} from "../crossing-vacations-dialog/crossing-vacations-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {VacationTransfer} from "../../model/VacationTransfer";

const ELEMENT_DATA: User[] = [];


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  vacationTransferArr : VacationTransfer[] = [];
  //@ts-ignore
  vacationsMap : any = {};
  userMap : any = {};

  constructor(private departmentService : DepartmentService,
              private userService : UserService,
              private headerService : HeaderService,
              private vacationService : VacationService,
              private notificationService : NotificationService,
              public dialog : MatDialog,
              private notifierService : NotifierService) { }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<User>;

  ngOnInit(): void {
    this.userService.getUser().subscribe(response => {
      this.fillUserArray(response.departmentId);
    })
    this.vacationService.getVacationTransferList(this.headerService.currentUser.id).subscribe(response => {
      this.vacationTransferArr = response;
      console.log(this.vacationTransferArr);
      if (this.vacationTransferArr.length > 0) {
        this.vacationTransferArr.forEach(transfer => {
            this.vacationService.getVacationById(transfer.vacationId).subscribe(response => {
              this.vacationsMap[transfer.id] = response;
              this.userService.getUserById(this.vacationsMap[transfer.id].userId).subscribe(response => {
                this.userMap[transfer.id] = response;
                console.log(this.vacationsMap);
                console.log(this.userMap);
              });
            });
        })
      }

    })
  }

  displayedColumns: string[] = ['demo-name', 'demo-position', 'demo-vacations', 'demo-approvals', 'demo-approve'];
  dataSource = ELEMENT_DATA;
  nextYear = new Date().getFullYear() + 1;
  currentYear = new Date().getFullYear();

  fillUserArray(departmentId : number) {

    ELEMENT_DATA.length = 0;

    this.departmentService.getUserListByDepartmentId(departmentId).subscribe(
      response => {
        response.forEach(user => {
          ELEMENT_DATA.push(user);
        });
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

      console.log(response);

      // @ts-ignore
      ELEMENT_DATA.find(el => {return el.id === response.id}).vacations = response.vacations;

      //on success will provide notification for user and change buttons state, notify user about success

      let notification = new NotificationToSend(
'DEPARTMENT_HEAD_APPROVED_USER_VACATIONS',
        this.headerService.currentUser.id,
        user.id
      );

      this.notificationService.sendNotification(notification).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });

    }, error => {
      console.log(error);
    });
  }

  disapproveUserVacations(user : any) {
    this.vacationService.disapproveUserVacations(user).subscribe(response => {
      let index = ELEMENT_DATA.findIndex(user => {
        return user.id === response.id;
      });
      ELEMENT_DATA[index] = response;
      this.table.renderRows();

      let notification = new NotificationToSend(
        'DEPARTMENT_HEAD_REJECTED_USER_VACATIONS',
        this.headerService.currentUser.id,
        user.id
      );

      this.notificationService.sendNotification(notification).subscribe(response => {
        // console.log(response);
      }, error => {
        console.log(error);
      });

      this.notifierService.notify("success", "Вы вернули на доработку график отпусков " + user.firstName + " " + user.lastName + "!");
    }, error => {
      console.log(error);
      this.notifierService.notify("error", error.error.message);
    })
  }

  isUserVacationsApprovedByHead(vacations : Vacation[]) {
    if (vacations) {
      let found = vacations.some(function (el) {
        return el.departmentHeadApproval === 'NOT_APPROVED';
      });
      return !found;
    } else {
      return false;
    }
  }

  compareDates(dateString : string) {
    return new Date(dateString).getFullYear() === this.nextYear;
  }

  showCrossingVacationsDialog() {
    console.log(this.dataSource);
    const dialogRef = this.dialog.open(CrossingVacationsDialogComponent, {
      width: '480px',
      data: this.dataSource
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  approve(transfer: any, $event: MouseEvent) {
    this.vacationService.approveTransfer(transfer).subscribe(response => {
      const index = this.vacationTransferArr.indexOf(transfer);
      if (index > -1) {
        this.vacationTransferArr.splice(index, 1);
      }
    }, error => {
      console.log(error);
    });

  }

  reject(transfer: any, $event: MouseEvent) {
    this.vacationService.rejectTransfer(transfer).subscribe(response => {
      const index = this.vacationTransferArr.indexOf(transfer);
      if (index > -1) {
        this.vacationTransferArr.splice(index, 1);
      }
    }, error => {
      console.log(error);
    });
  }

}
