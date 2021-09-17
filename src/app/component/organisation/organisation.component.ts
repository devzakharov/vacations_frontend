import {Component, OnInit, ViewChild} from '@angular/core';
import {OrganisationService} from "../../service/organisation/organisation.service";
import {HeaderService} from "../../service/header/header.service";
import {UserService} from "../../service/user/user.service";
import {MatTable} from "@angular/material/table";
import {HRDepartment} from "../../model/HRDepartment";
import * as moment from "moment";
import {HROrganisation} from "../../model/HROrganisation";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {HRUser} from "../../model/HRUser";
import {VacationService} from "../../service/vacation/vacation.service";
import {MatDialog} from "@angular/material/dialog";
import {UserEditDialogComponent} from "../user-edit-dialog/user-edit-dialog.component";
import {UserAddLeaveDialogComponent} from "../user-add-leave-dialog/user-add-leave-dialog.component";
import {Vacation} from "../../model/Vacation";
import {NotificationToSend} from "../../model/NotificationToSend";
import {NotificationService} from "../../service/notification/notification.service";
import {UserAddDialogComponent} from "../user-add-dialog/user-add-dialog.component";
import {DepartmentService} from "../../service/department/department.service";
import {readSpanComment} from "@angular/compiler-cli/src/ngtsc/typecheck/src/comments";
import {NotifierService} from "angular-notifier";
import {DepartmentAddDialogComponent} from "../department-add-dialog/department-add-dialog.component";

const ELEMENT_DATA: HRDepartment[] = [];

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrganisationComponent implements OnInit {

  displayedColumns: string[] = ['user-name', 'user-position', 'user-vacations'];
  dataSource = ELEMENT_DATA;
  organisation : HROrganisation | undefined;

  expandedElement: HRUser | null | undefined;

  constructor(public organisationService : OrganisationService,
              private headerService : HeaderService,
              private userService : UserService,
              public vacationService : VacationService,
              public dialog : MatDialog,
              private notificationService : NotificationService,
              private departmentService : DepartmentService,
              private notifierService : NotifierService) { }

  ngOnInit(): void {
    this.getDataForComponent();
  }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<HRDepartment>;

  getDataForComponent() {
    this.userService.getUser().subscribe(
      response => {
        this.organisationService.getUsersGroupingByDepartments(response.organisationId).subscribe(response => {
          console.log(response);
          ELEMENT_DATA.length = 0;
          this.organisation = response;
          response.departments.forEach(department => {
            // console.log(department);
            ELEMENT_DATA.push(department);
          });
          // console.log(this.dataSource);
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      }
    );
  }


  parseStringToDate(dateString: string) {
    return moment(dateString).format('DD.MM.YYYY');
  }

  addLeaveDays(user: HRUser) {
    console.log(user.vacations[0]);
    this.vacationService.vacationTypeToEmoji(user.vacations[0]);
    user.vacations.push(user.vacations[0]);
  }

  openUserEditDialog(user : HRUser, $event : any): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '480px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog (openUserEditDialog) was closed');
      this.getDataForComponent();
    });
  }

  openUserAddLeaveDialog(user : HRUser, $event : any) : void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(UserAddLeaveDialogComponent, {
      width: '310px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog (openUserAddLeaveDialog) was closed');
      console.log(result);
    });
  }

  userHasNotCommonVacations(user : HRUser) : boolean {
    if (user.vacations) {
      if (!user.vacations.some(vacation => {
        return vacation.vacationType === "COMMON"
      })) return true;
    }
    return false;
  }

  isAllCommonVacationsApproved(department : HRDepartment) : boolean {

    // console.log(department);

    return !(department.users || []).some(
      user => (user.vacations || []).some(
        vacation => vacation.vacationType === 'COMMON' && vacation.departmentHeadApproval !== 'APPROVED'));

  }

  isUsersHasVacations(department : HRDepartment) : boolean {
    return (department.users || []).some(
      user => user.vacations !== null)
  }

  removeVacation(user : HRUser, vacation: Vacation) {
    console.log(vacation);

    this.vacationService.removeVacation(vacation).subscribe(
      response => {
        console.log(response);

        //delete vacation from user object
        let index = user.vacations.findIndex(v => v.id === vacation.id);
        user.vacations.splice(index, 1);

        //send notification to user
        let notification = new NotificationToSend(
          'PERSONNEL_OFFICER_DELETED_LEAVE',
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
      }
    );
  }

  openAddUserDialog(organisation: HROrganisation) {
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      width: '480px',
      data: organisation
    });

    dialogRef.afterClosed().subscribe(response => {
      console.log('The dialog openAddUserDialog was closed');
      console.log(response);
      this.ngOnInit();
    });
  }

  deleteDepartment(department: HRDepartment) {
    console.log(department);

    if (department.users.length > 0 && department.users != null) {
      this.notifierService.notify('warning', 'Отдел "' + department.displayName + '" нельзя удалить, т.к. в нем есть сотрудники!');
      return;
    }

    this.departmentService.deleteDepartment(department).subscribe(
      response => {
        console.log(response);
        this.ngOnInit();
      }, error => {
        console.log(error);
        this.notifierService.notify('error', error.error.message);
      }
    );
  }

  openAddDepartmentDialog(organisation: HROrganisation) {
    const dialogRef = this.dialog.open(DepartmentAddDialogComponent, {
      width: '480px',
      data: organisation
    });

    dialogRef.afterClosed().subscribe(response => {
      console.log('The dialog openAddDepartmentDialog was closed');
      console.log(response);
      this.ngOnInit();
    });
  }

  downloadDocxFile(link : string, $event: any) {
    console.log(link);
    $event.stopPropagation();

    if (link != null) {

      let encodedLink = btoa(link)

      this.vacationService.getFile(encodedLink).subscribe(response => {
        let blob = new Blob([response], { type: 'application/octet-stream' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "document.docx";
        link.click();
      }, error => {
        console.log(error);
      })
    }
  }
}
