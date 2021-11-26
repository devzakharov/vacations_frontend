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
  factualOrganisationId : number;
  status : string;
  vacationsApproval : string;
  roles : Role[];
  password : string;
  servicedOrganisations : Organisation[];
  dateOfEmployment : string;

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
    factualOrganisationId : number,
    status: string,
    vacationsApproval: string,
    roles: Role[],
    password : string,
    servicedOrganisations : Organisation[],
    dateOfEmployment : string
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
    this.factualOrganisationId = factualOrganisationId;
    this.status = status;
    this.vacationsApproval = vacationsApproval;
    this.roles = roles;
    this.password = password;
    this.servicedOrganisations = servicedOrganisations;
    this.dateOfEmployment = dateOfEmployment;
  }
}
