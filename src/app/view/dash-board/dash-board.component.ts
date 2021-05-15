import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Staff} from "../../model/Staff";
import {ConfigService} from "../../service/config.service";
import Swal from "sweetalert2";
import {WebSocketService} from "../../service/web-socket.service";

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit,OnDestroy {

  currentUser!: Staff;
  currentMenu!: string

  constructor(public userService: UserService
              ,private router: Router
              ,public configService:ConfigService
              ,private webSocket: WebSocketService) { }

  ngOnInit(): void {
    this.userService.getAdminUser().subscribe(value => {
      this.currentUser= value;
      this.webSocket.commonMessageForAll();
    },error => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigateByUrl('/main')
    });
  }
  ngOnDestroy(): void {
    this.webSocket.closeWebSocket();
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
}
