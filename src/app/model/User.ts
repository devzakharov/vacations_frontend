import {Role} from "../type/Role";
import {HROrganisation} from "./HROrganisation";
import {Organisation} from "./Organisation";

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
  servicedOrganisations : Organisation[];

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
    password : string,
    servicedOrganisations : Organisation[]
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
    this.servicedOrganisations = servicedOrganisations;
  }
}
