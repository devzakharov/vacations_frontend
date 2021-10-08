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
import {RoleService} from "../../service/role/role.service";

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
    public departmentService : DepartmentService,
    private roleService: RoleService) {}

  resultRoles: Role[] = [];
  resultServicedOrganisations : Organisation[] = [];

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.organisationService.setOrganisationArray();
    this.refreshDepartmentsArray(this.data.organisationId, null);
    this.excludeExistingUserRoles(this.data.roles);
    // this.excludeExistingUserServicedOrganisations(this.data.servicedOrganisations);
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

  hasAccountantRole(user: HRUser) {
    return user.roles.some(role => {
      return role.name === 'ROLE_ACCOUNTANT'
    });
  }

  hasPersonnelOfficerRole(user: HRUser) {
    return user.roles.some(role => {
      return role.name === 'ROLE_PERSONNEL_OFFICER'
    });
  }

  excludeExistingUserRoles(roles : Role[]) {

    let map = new Map(roles.map(i => [i.id, i]));

    this.roleService.getAllRoles().subscribe(response => {
      this.resultRoles = response.filter(item => !map.has(item.id));
    }, error => {
      console.log(error);
    });
  }

  excludeExistingUserServicedOrganisations(organisations : Organisation[]) {

    let map = new Map(organisations.map(i => [i.id, i]));

    this.organisationService.getOrganisationArray().subscribe(response => {
      this.resultServicedOrganisations = response.filter(item => !map.has(item.id));
      // this.excludeMainOrganisation(this.data.organisationId);
    }, error => {
      console.log(error);
    });
  }

  excludeMainOrganisation(id : number) {
    let index = this.resultServicedOrganisations.findIndex(organisation => organisation.id === id);
    this.resultServicedOrganisations.splice(index, 1);
  }

  removeRole(removedRole: Role) {
    let index = this.data.roles.findIndex(role => role.id === removedRole.id);
    this.data.roles.splice(index, 1);
    this.ngOnInit();
  }

  addRole(addedRole: Role) {
    this.data.roles.push(addedRole);
    this.ngOnInit();
  }

  removeServicedOrganisation(servicedOrganisation: Organisation) {
    let index = this.data.servicedOrganisations.findIndex(role => role.id === servicedOrganisation.id);
    this.data.servicedOrganisations.splice(index, 1);
    this.ngOnInit();
  }

  addServicedOrganisation(servicedOrganisation: Organisation) {
    this.data.servicedOrganisations.push(servicedOrganisation);
    this.ngOnInit();
  }

  userHasOrganisation(servicedOrganisation: Organisation) {
    return this.data.servicedOrganisations.find(o => o.id === servicedOrganisation.id);
  }

}
