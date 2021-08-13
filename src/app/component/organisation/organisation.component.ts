import {Component, OnInit, ViewChild} from '@angular/core';
import {OrganisationService} from "../../service/organisation/organisation.service";
import {HeaderService} from "../../service/header/header.service";
import {UserService} from "../../service/user/user.service";
import {MatTable} from "@angular/material/table";
import {HRDepartment} from "../../model/HRDepartment";
import * as moment from "moment";

const ELEMENT_DATA: HRDepartment[] = [];

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  displayedColumns: string[] = ['demo-name', 'demo-position', 'demo-vacations', 'demo-approvals', 'demo-approve'];
  dataSource = ELEMENT_DATA;

  constructor(private organisationService : OrganisationService,
              private headerService : HeaderService,
              private userService : UserService) { }

  ngOnInit(): void {
    this.getDataForComponent();
  }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<HRDepartment>;

  getDataForComponent() {
    this.userService.getUser().subscribe(
      response => {
        this.organisationService.getUsersGroupingByDepartments(response.organisationId).subscribe(response => {
          console.log(response);
          response.forEach(user => {
            console.log(user);
            ELEMENT_DATA.push(user);
          });
          console.log(this.dataSource);
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      }
    );
  }


  parseStringToDate(dateString: string) {
    return moment(dateString).format('DD.MM.YYYY');
  }
}
