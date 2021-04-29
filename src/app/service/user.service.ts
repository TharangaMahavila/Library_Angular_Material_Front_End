import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {User} from "../model/User";
import {Router} from "@angular/router";
import {Staff} from "../model/Staff";
import {Student} from "../model/Student";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  constructor(private http: HttpClient
              ,private config:ConfigService
              ,private router: Router) {}

  authenticate(uname:string,pwd:string):Observable<any>{
    const body = {
      username: uname,
      password: pwd
    }
    return this.http.post(this.config.BASE_URL+`/api/v1/authenticate`,body,{
      responseType: 'text'
    });
  }

  getUser(): Observable<User>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<User>(this.config.BASE_URL+`/api/v1/users`);
    }
  }

  getAdminUser(): Observable<Staff>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Staff>(this.config.BASE_URL+`/api/v1/users/adminUser`);
    }
  }

  getStaffUser(): Observable<Staff>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Staff>(this.config.BASE_URL+`/api/v1/users/staffUser`);
    }
  }

  getStudentUser(): Observable<Student>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Student>(this.config.BASE_URL+`/api/v1/users/studentUser`);
    }
  }
}
