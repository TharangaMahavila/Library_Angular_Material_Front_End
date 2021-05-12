import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket!: WebSocket;

  stompClient: any

  constructor() { }

  public openWebSocket(channels: string[]){
    let ws = new SockJS('http://localhost:8080/websocket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({},()=>{
      for (const channel of channels) {
        this.stompClient.subscribe(''+channel+'',(data:any)=>{
          alert('subscribed'+data.toString());
        });
      }
    });
  }

  public closeWebSocket(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    alert("Disconnected");
  }

  errorCallBack(channels:string[]) {
    setTimeout(() => {
      this.openWebSocket(channels);
    }, 5000);
  }

  onMessageReceived(message:any) {
    alert("Message Recieved from Server :: " + message);
  }
}
