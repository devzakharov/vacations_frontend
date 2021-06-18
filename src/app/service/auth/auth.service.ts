import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as globals from "../../globals";
import type {TokenResponse} from "../../type/TokenRespone";

@Injectable({
  providedIn: 'root'
 })
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username:string, password:string) {
    return this.http.post<TokenResponse>(globals.server + '/api/v1/auth/login', {username, password});
  }

  setSession(authResult: { username: string; token: string; }) {
    localStorage.setItem('token', authResult.token);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
