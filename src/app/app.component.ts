import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./service/auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/angular-notifier/styles.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  constructor(private http: HttpClient,
              public authService: AuthService) {
  }

  onActivate(event: any): void {

  }
}
