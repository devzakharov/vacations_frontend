import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VacationService} from "../../service/vacation/vacation.service";
import {Vacation} from "../../model/Vacation";

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {

  formDataForUpload : FormData | undefined;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileAttr = 'Выберите Файл';

  constructor(
    public dialogRef: MatDialogRef<UploadFileDialogComponent>,
    private vacationService : VacationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];

    if (file) {
      this.fileAttr = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      formData.append("vacationId", this.data.vacation.id.toString());
      formData.append("fileType", "statement");

      this.formDataForUpload = formData;

    } else {
      this.fileAttr = 'Выберите Файл';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

  saveFile(formData : FormData) {

    this.vacationService.saveFile(formData).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(error);
      }
    );

  }
}
