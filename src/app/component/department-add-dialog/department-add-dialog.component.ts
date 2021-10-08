import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HROrganisation} from "../../model/HROrganisation";
import {UserService} from "../../service/user/user.service";
import {NotifierService} from "angular-notifier";
import {HeaderService} from "../../service/header/header.service";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {DepartmentService} from "../../service/department/department.service";

@Component({
  selector: 'app-department-add-dialog',
  templateUrl: './department-add-dialog.component.html',
  styleUrls: ['./department-add-dialog.component.css']
})
export class DepartmentAddDialogComponent implements OnInit {

  department : any = {organisationId : this.data.id, displayName : ''}

  constructor(
    public dialogRef: MatDialogRef<DepartmentAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HROrganisation,
    private userService : UserService,
    private notifierService : NotifierService,
    public headerService : HeaderService,
    public organisationService : OrganisationService,
    public departmentService : DepartmentService) {}

  ngOnInit(): void {
    this.organisationService.getOrganisationArray().subscribe(response => {
      this.organisationService.organisationsArray = response;
    }, error => {
      console.log(error);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addDepartment(department: any) {
    this.departmentService.addDepartment(department).subscribe(response => {
      console.log(response);
      this.notifierService.notify('success', 'Отдел ' + department.displayName + ' добавлен!');
      this.dialogRef.close();
    }, error => {
      console.log(error);
      this.notifierService.notify('error', error.error.message);
    });
  }

  changeDepartmentOrganisationId(id: number) {
    this.department.organisationId = id;
  }
}
