import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    let tokenizedReq = null;
    if(token !== null){
      tokenizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          jwt: token
        }
      });
    }else {
      tokenizedReq = req;
    }
    return next.handle(tokenizedReq);
  }
}
