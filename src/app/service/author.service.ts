import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Author} from "../model/Author";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  dropdownList: Array<Author> = [];
  selectedItems: Array<Author> = [];
  isTakenAuthorName = false;

  constructor(private http: HttpClient
              ,private config: ConfigService) { }

  saveAuthor(name: string): Observable<Author>{
    const body:Author = {
      id:0,
      name:name
    }
    return this.http.post<Author>(this.config.BASE_URL+`/api/v1/authors`,body);
  }

  getAllAuthors(): Observable<Array<Author>>{
    return this.http.get<Array<Author>>(this.config.BASE_URL+`/api/v1/authors`);
  }
}
