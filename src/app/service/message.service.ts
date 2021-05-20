import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Author} from "../model/Author";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient
              ,private configService: ConfigService) { }

  sendCommonMessage(message: string): Observable<any>{
    const body = {
      messageContent: message
    }
    return this.http.post<Author>(this.configService.BASE_URL+`/api/v1/messages/send-common-message`,body);
  }
}
