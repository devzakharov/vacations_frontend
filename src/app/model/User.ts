import {Role} from "../type/Role";

export class User {
  id : number;
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
  password : string;

  constructor(
    id : number,
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
    roles: Role[],
    password : string
  ) {
    this.id = id;
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
    this.password = password;
  }
}
