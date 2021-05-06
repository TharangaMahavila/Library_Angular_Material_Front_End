import { Injectable } from '@angular/core';
import {User} from "../model/User";
import {Observable, Subscribable} from "rxjs";
import {CartItem} from "../model/CartItem";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: Array<CartItem> = [];

  constructor(private http: HttpClient
              ,private config: ConfigService) { }

  getAllCartItems(userId: string): Observable<Array<CartItem>>{
    return this.http.get<Array<CartItem>>(this.config.BASE_URL+`/api/v1/cart/${userId}`);
  }

  addCartItem(userId: string, refId: string): Observable<any>{
    const body = {
      userId: userId,
      refId: refId,
      requestedAt: null,
      requestStatus: false
    }
    return this.http.post(this.config.BASE_URL+`/api/v1/cart`,body);
  }

  removeCartItem(userId: string, refNo: string): Observable<string>{
    return this.http.delete(this.config.BASE_URL+`/api/v1/cart/${userId}/${refNo}`,{
      responseType: 'text'
    });
  }

  requestCartItem(userId: string, refNo: string): Observable<string>{
    const body = {
      userId: userId,
      refId: refNo,
      requestedAt: new Date(),
      requestStatus: true
    }
    return this.http.put(this.config.BASE_URL+`/api/v1/cart/${userId}/${refNo}`,body,{
      responseType: 'text'
    });
  }

}
