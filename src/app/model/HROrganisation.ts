import {Organisation} from "./Organisation";
import {HRDepartment} from "./HRDepartment";

export class HROrganisation extends Organisation{
  id : number;
  inn : string;
  name : string;
  displayName : string;
  departments : HRDepartment[];

  constructor(id: number, inn: string, name: string, displayName: string, departments : HRDepartment[]) {
    super(id, inn, name, displayName);
    this.id = id;
    this.inn = inn;
    this.name = name;
    this.displayName = displayName;
    this.departments = departments;
  }

}
