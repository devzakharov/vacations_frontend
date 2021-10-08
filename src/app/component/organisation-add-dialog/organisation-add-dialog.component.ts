import { Component, OnInit } from '@angular/core';
import {HROrganisation} from "../../model/HROrganisation";
import {HRDepartment} from "../../model/HRDepartment";
import {OrganisationService} from "../../service/organisation/organisation.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-organisation-add-dialog',
  templateUrl: './organisation-add-dialog.component.html',
  styleUrls: ['./organisation-add-dialog.component.css']
})
export class OrganisationAddDialogComponent implements OnInit {

  //@ts-ignore
  organisation : HROrganisation = new HROrganisation(0, '', '', '', null);

  constructor(private organisationService : OrganisationService, public dialogRef: MatDialogRef<OrganisationAddDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOrganisation(organisation: HROrganisation) {
    this.organisationService.addOrganisation(organisation).subscribe(response => {
      console.log(response);
      this.dialogRef.close();
    }, error => {
      console.log(error);
    })
  }
}
