import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import {HRUser} from "../../model/HRUser";
import {Role} from "../../type/Role";
import {UserService} from "../../service/user/user.service";
import {NotifierService} from "angular-notifier";
import {HeaderService} from "../../service/header/header.service";
import {Organisation} from "../../model/Organisation";
import {Department} from "../../model/Department";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {DepartmentService} from "../../service/department/department.service";

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HRUser,
    private userService : UserService,
    private notifierService : NotifierService,
    public headerService : HeaderService,
    public organisationService : OrganisationService,
    public departmentService : DepartmentService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.organisationService.setOrganisationArray();
    this.refreshDepartmentsArray(this.data.organisationId, null);
  }

  hasDepartmentHeadRole(user : HRUser) : boolean {
    if (user.roles.some(role => { return role.name === 'ROLE_DEPARTMENT_HEAD' })) {
      return true;
    } else {
      return false;
    }
  }

  toggleDepartmentHeadRole(user : HRUser) {
    if (user.roles.some(role => { return role.name === 'ROLE_DEPARTMENT_HEAD' })) {
      let index = user.roles.findIndex(el => {return el.id === 7});
      user.roles.splice(index, 1);
      console.log(user.roles);
    } else {
      let role : Role = {id: 7, name: "ROLE_DEPARTMENT_HEAD", displayName: "Начальник Отдела"}
      user.roles.push(role);
      console.log(user.roles);
    }
  }

  saveUser(data: HRUser) {
    this.userService.saveUser(data).subscribe(
      response => {
        console.log(response);
        this.dialogRef.close();
        this.notifierService.notify('success', 'Пользователь сохранен!')
      }, error => {
        this.notifierService.notify('error', error.error.message);
      }
    )
  }

  refreshDepartmentsArray(organisation : number, $event : any) {
    console.log($event);
    if ($event != null) this.data.organisationId = $event.value;
    this.departmentService.getDepartmentsArrayByOrganisationId(this.data.organisationId);
  }

  setDepartmentValue($event: any) {
    this.data.departmentId = $event.value;
  }
}
