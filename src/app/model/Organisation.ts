export class Organisation {
  id : number;
  inn : string;
  name : string;
  displayName : string;

  constructor(id: number, inn: string, name: string, displayName: string) {
    this.id = id;
    this.inn = inn;
    this.name = name;
    this.displayName = displayName;
  }
}
