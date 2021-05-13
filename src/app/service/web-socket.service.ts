import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  stompClient: any

  constructor() { }

  public commonMessageForAll(){
    let ws = new SockJS('http://localhost:8080/websocket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe('/topic/messages/common',(data:any)=>{
        alert(JSON.parse(data.body).content);
      });
    },this.errorCallBack);
  }

  public closeWebSocket(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  errorCallBack() {
    setTimeout(() => {
      this.commonMessageForAll();
    }, 5000);
  }
}
