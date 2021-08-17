import {Component, OnInit, ViewChild} from '@angular/core';
import {OrganisationService} from "../../service/organisation/organisation.service";
import {HeaderService} from "../../service/header/header.service";
import {UserService} from "../../service/user/user.service";
import {MatTable} from "@angular/material/table";
import {HRDepartment} from "../../model/HRDepartment";
import * as moment from "moment";
import {HROrganisation} from "../../model/HROrganisation";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {HRUser} from "../../model/HRUser";

const ELEMENT_DATA: HRDepartment[] = [];

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrganisationComponent implements OnInit {

  displayedColumns: string[] = ['user-name', 'user-position', 'user-vacations'];
  dataSource = ELEMENT_DATA;
  organisation : HROrganisation | undefined;

  expandedElement: HRUser | null | undefined;

  constructor(public organisationService : OrganisationService,
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
          // console.log(response);
          ELEMENT_DATA.length = 0;
          this.organisation = response;
          response.departments.forEach(department => {
            console.log(department);
            ELEMENT_DATA.push(department);
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
