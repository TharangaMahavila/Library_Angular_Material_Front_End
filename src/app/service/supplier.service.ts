import { Injectable } from '@angular/core';
import {Supplier} from "../model/Supplier";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  dropdownList: Array<Supplier> = [];
  selectedItems: Array<Supplier> = [];
  isTakenSupplierName = false;

  constructor(private http: HttpClient
              ,private configService: ConfigService) { }

  saveSupplier(name: string): Observable<Supplier>{
    const body: Supplier={
      id:0,
      name:name
    }
    return this.http.post<Supplier>(this.configService.BASE_URL+`/api/v1/suppliers`,body);
  }

  getAllSupplier(): Observable<Array<Supplier>>{
    return this.http.get<Array<Supplier>>(this.configService.BASE_URL+'/api/v1/suppliers');
  }
}
