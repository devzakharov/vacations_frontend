export class Department {
  id : number;
  organisation_id : number;
  name : string;
  displayName : string;


  constructor(id: number, organisation_id: number, name: string, displayName: string) {
    this.id = id;
    this.organisation_id = organisation_id;
    this.name = name;
    this.displayName = displayName;
  }
}
