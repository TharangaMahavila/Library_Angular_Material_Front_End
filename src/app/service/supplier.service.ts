import { Injectable } from '@angular/core';
import {Supplier} from "../model/Supplier";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  dropdownList: Array<Supplier> = [];
  selectedItems: Array<Supplier> = [];
  isTakenSupplierName = false;

  constructor(private http: HttpClient) { }

  saveSupplier(name: string): Observable<Supplier>{
    const body: Supplier={
      id:0,
      name:name
    }
    return this.http.post<Supplier>(`http:localhost:8080/api/v1/suppliers`,body);
  }

  getAllSupplier(): Observable<Array<Supplier>>{
    return this.http.get<Array<Supplier>>('http:localhost:8080/api/v1/suppliers');
  }
}
