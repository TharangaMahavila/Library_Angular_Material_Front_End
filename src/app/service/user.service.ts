import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {User} from "../model/User";
import {Router} from "@angular/router";
import {Staff} from "../model/Staff";
import {Student} from "../model/Student";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  currentStudentUser!: Student;
  currentStaffUser!: Staff;

  constructor(private http: HttpClient
              ,private configService:ConfigService
              ,private router: Router) {}

  authenticate(uname:string,pwd:string):Observable<any>{
    const body = {
      username: uname,
      password: pwd
    }
    return this.http.post(this.configService.BASE_URL+`/api/v1/authenticate`,body,{
      responseType: 'text'
    });
  }

  getUser(): Observable<User>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<User>(this.configService.BASE_URL+`/api/v1/users`);
    }
  }

  getAdminUser(): Observable<Staff>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Staff>(this.configService.BASE_URL+`/api/v1/users/adminUser`);
    }
  }

  getStaffUser(): Observable<Staff>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Staff>(this.configService.BASE_URL+`/api/v1/users/staffUser`);
    }
  }

  getStudentUser(): Observable<Student>{
    const token = localStorage.getItem('token');
    if(token === null){
      return throwError('Invalid token');
    }else {
      return this.http.get<Student>(this.configService.BASE_URL+`/api/v1/users/studentUser`);
    }
  }
}
