export class Department {
  id : number;
  organisation_id : number;
  name : string;
  display_name : string;


  constructor(id: number, organisation_id: number, name: string, display_name: string) {
    this.id = id;
    this.organisation_id = organisation_id;
    this.name = name;
    this.display_name = display_name;
  }
}
