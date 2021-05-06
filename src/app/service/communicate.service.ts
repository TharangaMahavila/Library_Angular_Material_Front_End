import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {

  private _adminMessageSource = new Subject<string>();
  adminMessage$ = this._adminMessageSource.asObservable();

  constructor() { }

  sendMessage(message: string){
    this._adminMessageSource.next(message);
  }
}
