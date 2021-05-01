import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Author} from "../model/Author";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  dropdownList: Array<Author> = [];
  selectedItems: Array<Author> = [];
  isTakenAuthorName = false;

  constructor(private http: HttpClient) { }

  saveAuthor(name: string): Observable<Author>{
    const body:Author = {
      id:0,
      name:name
    }
    return this.http.post<Author>(`http://localhost:8080/api/v1/authors`,body);
  }

  getAllAuthors(): Observable<Array<Author>>{
    return this.http.get<Array<Author>>(`http://localhost:8080/api/v1/authors`);
  }
}
