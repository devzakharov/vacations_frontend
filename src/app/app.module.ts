import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NotifierModule } from 'angular-notifier';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { HeaderComponent } from './component/header/header.component';
import {AddVacationDialog, VacationsComponent} from './component/vacations/vacations.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {CustomDateAdapter} from "./adapter/CustomDateAdapter";
import {InterceptorService} from "./service/interceptor/interceptor.service";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatBadge, MatBadgeModule} from "@angular/material/badge";
import { AccountComponent } from './component/account/account.component';
import { NotificationComponent } from './component/notification/notification.component';
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from '@angular/material/select';
import {VacationsFilter} from "./pipe/VacationsFilter";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import { DepartmentComponent } from './component/department/department.component';
import { OrganisationComponent } from './component/organisation/organisation.component';
import { AllOrganisationsComponent } from './component/all-organisations/all-organisations.component';
import {MatTable, MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from '@angular/material/tooltip';
import { UserEditDialogComponent } from './component/user-edit-dialog/user-edit-dialog.component';
import { UserAddLeaveDialogComponent } from './component/user-add-leave-dialog/user-add-leave-dialog.component';
import { MatCheckboxModule} from "@angular/material/checkbox";


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'vacations', component: VacationsComponent },
  { path: 'my-account', component: AccountComponent },
  { path: 'department', component: DepartmentComponent},
  { path: 'organisation', component: OrganisationComponent},
  { path: 'all-organisations', component: AllOrganisationsComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    VacationsComponent,
    AccountComponent,
    NotificationComponent,
    VacationsFilter,
    AddVacationDialog,
    DepartmentComponent,
    OrganisationComponent,
    AllOrganisationsComponent,
    UserEditDialogComponent,
    UserAddLeaveDialogComponent,
  ],
  imports: [
    MatNativeDateModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NotifierModule.withConfig({}),
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    NgbModule,
    MatBadgeModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
