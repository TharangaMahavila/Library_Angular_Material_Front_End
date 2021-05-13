import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {UserService} from "../../service/user.service";
import {CartItem} from "../../model/CartItem";
import {Student} from "../../model/Student";
import {Router} from "@angular/router";
import {Staff} from "../../model/Staff";
import Swal from "sweetalert2";
import {CartService} from "../../service/cart.service";
import {ConfigService} from "../../service/config.service";
import {BookCustom} from "../../model/BookCustom";
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "../../service/web-socket.service";

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit,OnDestroy {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  constructor(public userService: UserService
              ,private router: Router
              ,public cartService: CartService
              ,private configService: ConfigService
              ,private http: HttpClient
              ,public webSocket: WebSocketService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.webSocket.closeWebSocket();
  }

  getAllCartItems(userId: string){
    this.cartService.getAllCartItems(userId).subscribe(value => {
      this.cartService.cartItems = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: "error",
        title: "Failed to load the cart items"
      });
    });
  }

  deleteProfileImage(): void {
    alert('Delete profile image');
  }

  editProfilePhoto(): void {
    alert('Edit profile image');
  }

  logOut() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to log out",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigateByUrl('/main');
      }
    });
  }

  getCurrentUser(): void{
    var role = localStorage.getItem('role');
    if(role === 'student'){
      this.userService.getStudentUser().subscribe(value => {
        this.userService.currentStudentUser = value;
        this.webSocket.commonMessageForAll();
        this.getAllCartItems(this.userService.currentStudentUser.regNo);
      },error => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigateByUrl('/main')
      });
    }else if(role === 'staff'){
      this.userService.getStaffUser().subscribe(value => {
        this.userService.currentStaffUser = value;
        this.webSocket.commonMessageForAll();
        this.getAllCartItems(this.userService.currentStaffUser.id);
      },error => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigateByUrl('/main')
      })
    }
  }

  removeCartItem(cartItem: CartItem) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove "'+cartItem.bookCustomEntity.englishName+'" from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeCartItem(cartItem.userId, cartItem.bookCustomEntity.refNo).subscribe(value => {
          Swal.fire(
              'Deleted!',
              'Your Cart item has been deleted.',
              'success'
          );
          this.cartService.cartItems = this.cartService.cartItems.filter(obj => obj !== cartItem );
        },error => {
          Swal.fire(
              'Failed!',
              'Failed to delete your cart item',
              'error'
          );
        });
      }
    });
  }

  requestCartItem(cartItem: CartItem) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to request "'+cartItem.bookCustomEntity.englishName+'"',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Request'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.requestCartItem(cartItem.userId, cartItem.bookCustomEntity.refNo).subscribe(value => {
          Swal.fire(
              'Done!',
              'Your Cart item has been requested.',
              'success'
          );
          this.getAllCartItems(cartItem.userId);
        },error => {
          Swal.fire(
              'Failed!',
              'Failed to request your cart item',
              'error'
          );
        });
      }
    });
  }
}
