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

  constructor(private http: HttpClient
              ,private config: ConfigService) { }

  getAllCartItems(userId: string): Observable<Array<CartItem>>{
    return this.http.get<Array<CartItem>>(this.config.BASE_URL+`/api/v1/cart/${userId}`);
  }

  removeCartItem(userId: string, refNo: string): Observable<string>{
    return this.http.delete(this.config.BASE_URL+`/api/v1/cart/${userId}/${refNo}`,{
      responseType: 'text'
    });
  }

}
