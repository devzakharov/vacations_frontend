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
import {NotifierService} from "angular-notifier";
import {DepartmentAddDialogComponent} from "../department-add-dialog/department-add-dialog.component";
import {UploadFileDialogComponent} from "../upload-file-dialog/upload-file-dialog.component";
import {OrganisationAddDialogComponent} from "../organisation-add-dialog/organisation-add-dialog.component";
import {Organisation} from "../../model/Organisation";

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
  // organisation : HROrganisation | undefined;
  expandedElement: HRUser | null | undefined;
  // accessibleOrganisations : Organisation[] = [];

  constructor(public organisationService : OrganisationService,
              public headerService : HeaderService,
              private userService : UserService,
              public vacationService : VacationService,
              public dialog : MatDialog,
              private notificationService : NotificationService,
              private departmentService : DepartmentService,
              private notifierService : NotifierService) { }

  ngOnInit(): void {

    this.getAccessibleOrganisations();

    if (this.organisationService.currentOrganisation === undefined) {
      this.getDataForComponent();
    } else {
      this.refreshOrganisation();
    }
  }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<HRDepartment>;

  getDataForComponent() {
    this.userService.getUser().subscribe(
      response => {
        this.organisationService.getUsersGroupingByDepartments(response.organisationId).subscribe(
          response => {
            this.getAccessibleOrganisations();
            ELEMENT_DATA.length = 0;
            this.organisationService.currentOrganisation = response;
            this.organisationService.currentOrganisation.departments.forEach(department => {
            ELEMENT_DATA.push(department);
          });
          if (this.table) this.table.renderRows();
        }, error => {
          console.log(error);
        });

      }, error => {
        console.log(error);
      }
    );
  }

  refreshOrganisation() {
    if (this.organisationService.currentOrganisation) {
      this.organisationService.getUsersGroupingByDepartments(this.organisationService.currentOrganisation.id).subscribe(
        response => {
          this.getAccessibleOrganisations();
          ELEMENT_DATA.length = 0;
          this.organisationService.currentOrganisation = response;
          this.organisationService.currentOrganisation.departments.forEach(department => {
          ELEMENT_DATA.push(department);
        });
        if (this.table) this.table.renderRows();
      }, error => {
        console.log(error);
      });
    }

  }

  getAccessibleOrganisations() {
    if (this.headerService.isAdmin()) {
      this.organisationService.getOrganisationArray().subscribe(response => {
        this.organisationService.accessibleOrganisations = response;
      });
    } else {
      this.organisationService.accessibleOrganisations = this.headerService.currentUser.servicedOrganisations;
    }
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
      this.ngOnInit();
    });
  }

  openUserAddLeaveDialog(user : HRUser, $event : any) : void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(UserAddLeaveDialogComponent, {
      width: '310px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
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

  downloadDocxFile(vacation : any, $event: any) {
    $event.stopPropagation();

    if (vacation != null) {

      let link = btoa(vacation.vacationOrder.orderPath.substring(1));

      this.vacationService.getFile(link).subscribe(response => {
        let blob = new Blob([response], { type: 'application/octet-stream' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "order.docx";
        link.click();
      }, error => {
        console.log(error);
      })
    }
  }

  downloadImageFile(vacation: any, $event : any, fileType : string) {
    $event.stopPropagation()
    if (vacation != null) {

      let link = '';

      if (fileType === 'order') {
        link = btoa(vacation.vacationOrder.signedOrderPath.substring(1));
      } else if (fileType === 'statement') {
         link = btoa(vacation.vacationStatement.signedStatementPath.substring(1));
      }

      this.vacationService.getFile(link).subscribe(response => {

        let blob = new Blob([response], { type: 'application/octet-stream' });

        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          let base64data = reader.result;
          // console.log(base64data);

          let image = new Image();
          if (typeof base64data === "string") {
            image.src = base64data;
          }
          // image.src = "data:image/jpg;base64," + base64data;

          let w = window.open("");
          // @ts-ignore
          w.document.write(image.outerHTML);
        }
      }, error => {
        console.log(error);
      })
    }
  }

  uploadFileDialog(vacation: any) {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      data: {
        vacation : vacation,
        fileType : 'order'
      },
      width : '300px'
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  openAddOrganisationDialog(organisation: HROrganisation) {
    const dialogRef = this.dialog.open(OrganisationAddDialogComponent, {
      data: {
        organisation : organisation,
      },
      width : '480px'
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  switchOrganisation(servicedOrganisation: Organisation) {
    this.organisationService.getHROrganisation(servicedOrganisation.id).subscribe(response => {
      this.organisationService.currentOrganisation = response;
    }, error => {
      this.notifierService.notify('error', error.error.message);
    });
  }

}
