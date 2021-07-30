import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/User";
import {DepartmentService} from "../../service/department/department.service";
import {UserService} from "../../service/user/user.service";
import {HeaderService} from "../../service/header/header.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import * as moment from 'moment';

const ELEMENT_DATA: User[] = [];


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  constructor(private departmentService : DepartmentService,
              private userService : UserService,
              private headerService : HeaderService) { }

  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<User>;

  ngOnInit(): void {
    this.userService.getUser().subscribe(response => {
      this.fillUserArray(response.departmentId);
    })
  }

  displayedColumns: string[] = ['demo-name', 'demo-position', 'demo-vacations', 'demo-approvals', 'demo-approve'];
  dataSource = ELEMENT_DATA;

  fillUserArray(departmentId : number) {

    console.log(this.headerService.currentUser.departmentId);

    ELEMENT_DATA.length = 0;

    this.departmentService.getUserListByDepartmentId(departmentId).subscribe(
      response => {
        console.log(response);
        response.forEach(user => {
          console.log(user);
          ELEMENT_DATA.push(user);

        });
        console.log(this.dataSource);
        this.table.renderRows();
      }, error => {
        console.log(error);
      }
    )
  }

  parseStringToDate(dateString: string) {
    return moment(dateString).format('DD.MM.YYYY');
  }
}
