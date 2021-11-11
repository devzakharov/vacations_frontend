import {Component, Inject, OnInit} from '@angular/core';
import {Organisation} from "../../model/Organisation";
import {Department} from "../../model/Department";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HRUser} from "../../model/HRUser";
import {UserService} from "../../service/user/user.service";
import {NotifierService} from "angular-notifier";
import {HeaderService} from "../../service/header/header.service";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {DepartmentService} from "../../service/department/department.service";
import {Role} from "../../type/Role";
import {HROrganisation} from "../../model/HROrganisation";
import {User} from "../../model/User";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-user-add-dialog',
  templateUrl: './user-add-dialog.component.html',
  styleUrls: ['./user-add-dialog.component.css']
})
export class UserAddDialogComponent implements OnInit {

  date = new FormControl();

  user : HRUser = new HRUser(0,
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    this.headerService.currentUser.organisationId,
    'ACTIVE',
    'NOT_APPROVED',
    [{id: 1, name: "ROLE_USER", displayName: "Сотрудник"}],
    '',
    [],
    [],
    '');

  constructor(
    public dialogRef: MatDialogRef<UserAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HROrganisation,
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
    this.refreshDepartmentsArray(this.headerService.currentUser.organisationId, null);
  }

  addUser(user: HRUser) {
    console.log(user);
    user.dateOfEmployment = this.date.value;
    this.userService.addNewUser(user).subscribe(response => {
      console.log(response);
      this.dialogRef.close();
      this.notifierService.notify('success', 'Сотрудник добавлен!')
    }, error => {
      console.log(error);
      this.notifierService.notify('error', error.error.message);
    });
  }

  refreshDepartmentsArray(organisation : number, $event : any) {
    console.log($event);
    if ($event != null) this.user.organisationId = $event.value;
    this.departmentService.getDepartmentsArrayByOrganisationId(this.user.organisationId);
  }

  setDepartmentValue($event: any) {
    this.user.departmentId = $event.value;
    console.log(this.user);
  }

  hasDepartmentHeadRole(user : HRUser) : boolean {
    return user.roles.some(role => {
      return role.name === 'ROLE_DEPARTMENT_HEAD'
    });
  }

  toggleDepartmentHeadRole(user : HRUser) {
    if (user.roles.some(role => { return role.name === 'ROLE_DEPARTMENT_HEAD' })) {
      let index = user.roles.findIndex(el => {return el.id === 7});
      user.roles.splice(index, 1);
      // console.log(user.roles);
    } else {
      let role : Role = {id: 7, name: "ROLE_DEPARTMENT_HEAD", displayName: "Начальник Отдела"}
      user.roles.push(role);
      // console.log(user.roles);
    }
  }

  hasAdminRole(user: HRUser) {
    return user.roles.some(role => {
      return role.name === 'ROLE_ADMIN'
    });
  }

  toggleAdminRole(user: HRUser) {
    if (user.roles.some(role => { return role.name === 'ROLE_ADMIN' })) {
      let index = user.roles.findIndex(el => {return el.id === 2});
      user.roles.splice(index, 1);
    } else {
      let role : Role = {id: 2, name: "ROLE_ADMIN", displayName: "Администратор"}
      user.roles.push(role);
    }
  }


  hasAccountantRole(user: HRUser) {
    return user.roles.some(role => {
      return role.name === 'ROLE_ACCOUNTANT'
    });
  }

  toggleAccountantRole(user: HRUser) {
    if (user.roles.some(role => { return role.name === 'ROLE_ACCOUNTANT' })) {
      let index = user.roles.findIndex(el => {return el.id === 5});
      user.roles.splice(index, 1);
    } else {
      let role : Role = {id: 5, name: "ROLE_ACCOUNTANT", displayName: "Бухгалтер"}
      user.roles.push(role);
    }
  }

  hasPersonnelOfficerRole(user: HRUser) {
    return user.roles.some(role => {
      return role.name === 'ROLE_PERSONNEL_OFFICER'
    });
  }

  togglePersonnelOfficerRole(user: HRUser) {
    if (user.roles.some(role => { return role.name === 'ROLE_PERSONNEL_OFFICER' })) {
      let index = user.roles.findIndex(el => {return el.id === 6});
      user.roles.splice(index, 1);
    } else {
      let role : Role = {id: 6, name: "ROLE_PERSONNEL_OFFICER", displayName: "Кадровик"}
      user.roles.push(role);
    }
  }

  removeServicedOrganisation(servicedOrganisation: Organisation) {
    let index = this.user.servicedOrganisations.findIndex(role => role.id === servicedOrganisation.id);
    this.user.servicedOrganisations.splice(index, 1);
    this.ngOnInit();
  }

  addServicedOrganisation(servicedOrganisation: Organisation) {
    if (this.user.servicedOrganisations.find(o => o.id === servicedOrganisation.id)) {
      return;
    } else {
      this.user.servicedOrganisations.push(servicedOrganisation);
    }
    console.log(this.user.servicedOrganisations)
    this.ngOnInit();
  }

  userHasOrganisation(servicedOrganisation: Organisation) {
    return this.user.servicedOrganisations.find(o => o.id === servicedOrganisation.id);
  }
}
