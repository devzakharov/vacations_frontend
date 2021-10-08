import { Component, OnInit } from '@angular/core';
import {OrganisationService} from "../../service/organisation/organisation.service";
import {HROrganisation} from "../../model/HROrganisation";
import {DepartmentService} from "../../service/department/department.service";
import {HRDepartment} from "../../model/HRDepartment";
import {NotifierService} from "angular-notifier";
import {HeaderService} from "../../service/header/header.service";
import {OrganisationAddDialogComponent} from "../organisation-add-dialog/organisation-add-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DepartmentAddDialogComponent} from "../department-add-dialog/department-add-dialog.component";

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.css']
})
export class AllOrganisationsComponent implements OnInit {

  organisationsArr : HROrganisation[] = [];
  //@ts-ignore
  organisationToAdd : HROrganisation = new HROrganisation(0, '', '', '', null);

  constructor(private organisationService : OrganisationService,
              private departmentService : DepartmentService,
              private notifierService : NotifierService,
              public dialog : MatDialog,
              public  headerService : HeaderService) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.organisationService.getHROrganisationArray().subscribe(response => {
      this.organisationsArr = response;
      console.log(response);
    }, error => {
      console.log(error);
    })
  }

  deleteDepartment(department : HRDepartment) {
    this.departmentService.deleteDepartment(department).subscribe(response => {
      console.log(response);
      this.notifierService.notify('success', department.displayName + ' успешно удален!');
      this.refreshData();
    }, error => {
      console.log(error);
      this.notifierService.notify('error', error.error.message);
    })
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

  openAddDepartmentDialog(organisation: HROrganisation) {
    const dialogRef = this.dialog.open(DepartmentAddDialogComponent, {
      width: '480px',
      data: organisation
    });

    dialogRef.afterClosed().subscribe(response => {
      this.ngOnInit();
    });
  }

  deleteOrganisation(organisation : HROrganisation) {
    this.organisationService.deleteOrganisation(organisation).subscribe(response => {
      console.log(response);
      this.notifierService.notify('success', 'Организация ' + organisation.displayName + ' успешно удалена!')
      this.ngOnInit();
    }, error => {
      console.log(error);
      this.notifierService.notify('error', error.error.message);
    });
  }
}
