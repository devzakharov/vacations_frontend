import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Observable } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router : Router) { }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem("token");

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer_" + token)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
