import {Role} from "../type/Role";

export class User {
  username : string;
  firstName : string;
  middleName : string;
  lastName : string;
  email : string;
  position : string;
  departmentId : number;
  organisationId : number;
  status : string;
  vacationsApproval : string;
  roles : Role[];

  constructor(
    username: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    position: string,
    departmentId: number,
    organisationId: number,
    status: string,
    vacationsApproval: string,
    roles: Role[]
  ) {
    this.username = username;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.email = email;
    this.position = position;
    this.departmentId = departmentId;
    this.organisationId = organisationId;
    this.status = status;
    this.vacationsApproval = vacationsApproval;
    this.roles = roles;
  }
}
