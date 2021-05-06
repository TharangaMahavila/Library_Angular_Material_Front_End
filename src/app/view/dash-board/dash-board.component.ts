import { Component, OnInit } from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Staff} from "../../model/Staff";
import {ConfigService} from "../../service/config.service";
import Swal from "sweetalert2";
import {CommunicateService} from "../../service/communicate.service";

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {

  currentUser!: Staff;
  currentMenu!: string

  constructor(public userService: UserService
              ,private router: Router
              ,private configService:ConfigService
              ,private communicateService: CommunicateService) { }

  ngOnInit(): void {
    this.userService.getAdminUser().subscribe(value => {
      this.currentUser= value;
    },error => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigateByUrl('/main')
    });

    this.communicateService.adminMessage$.subscribe(value => {
      alert(value);
    });
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
