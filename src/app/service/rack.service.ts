import { Injectable } from '@angular/core';
import {Rack} from "../model/Rack";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RackService {

  dropdownListRack: Array<Rack> = [];
  selectedItemsRack: Array<Rack> = [];
  isTakenRackNo = false;

  constructor(private http: HttpClient) { }

  saveRack(rackNo: string,shellNo: string): Observable<Rack>{
    const body: Rack={
      id:0,
      rackNo: rackNo,
      shellNo: shellNo
    }
    return this.http.post<Rack>('http:localhost:8080/api/v1/Racks',body);
  }

  getAllRack(): Observable<Array<Rack>>{
    return this.http.get<Array<Rack>>('http:localhost:8080/api/v1/Rack');
  }
}
