export class Organisation {
  id : number;
  inn : string;
  name : string;
  display_name : string;

  constructor(id: number, inn: string, name: string, display_name: string) {
    this.id = id;
    this.inn = inn;
    this.name = name;
    this.display_name = display_name;
  }
}
