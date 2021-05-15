import { Injectable } from '@angular/core';
import {Rack} from "../model/Rack";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class RackService {

  dropdownListRack: Array<Rack> = [];
  selectedItemsRack: Array<Rack> = [];
  isTakenRackNo = false;

  constructor(private http: HttpClient
              ,private configService: ConfigService) { }

  saveRack(rackNo: string,shellNo: string): Observable<Rack>{
    const body: Rack={
      id:0,
      rackNo: rackNo,
      shellNo: shellNo
    }
    return this.http.post<Rack>(this.configService.BASE_URL+'/api/v1/racks',body);
  }

  getAllRack(): Observable<Array<Rack>>{
    return this.http.get<Array<Rack>>(this.configService.BASE_URL+'/api/v1/racks');
  }
}
