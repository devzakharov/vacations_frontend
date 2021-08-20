import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HRUser} from "../../model/HRUser";

@Component({
  selector: 'app-user-add-leave-dialog',
  templateUrl: './user-add-leave-dialog.component.html',
  styleUrls: ['./user-add-leave-dialog.component.css']
})
export class UserAddLeaveDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserAddLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HRUser) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
