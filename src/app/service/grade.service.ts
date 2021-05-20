import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {Grade} from "../model/Grade";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor(private http:HttpClient
              ,private configService:ConfigService) { }

  getAllGrades(): Observable<Array<Grade>>{
    return this.http.get<Array<Grade>>(this.configService.BASE_URL+`/api/v1/grades`);
  }
}
