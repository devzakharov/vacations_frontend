import {Department} from "./Department";
import {HRUser} from "./HRUser";

export class HRDepartment extends Department{
  id: number;
  organisation_id: number;
  name: string;
  displayName: string;
  users: HRUser[];

  constructor(id: number, organisation_id: number, name: string, displayName: string, users: HRUser[]) {
    super(id, organisation_id, name, displayName);
    this.id = id;
    this.organisation_id = organisation_id;
    this.name = name;
    this.displayName = displayName;
    this.users = users;
  }

}
