import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  stompClient: any

  constructor(private configService: ConfigService) { }

  public commonMessageForAll(){
    let ws = new SockJS(this.configService.BASE_URL+'/websocket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe('/topic/messages/common',(data:any)=>{
        let audio = new Audio('../../assets/sounds/notification.mp3');
        audio.play();
        this.configService.showMessage('Admin',JSON.parse(data.body).content);
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
