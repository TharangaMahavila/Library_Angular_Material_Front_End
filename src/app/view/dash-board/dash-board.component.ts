import { Component, OnInit } from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Staff} from "../../model/Staff";

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {

  currentUser!: Staff;
  currentMenu!: string

  constructor(public userService: UserService
              ,private router: Router) { }

  ngOnInit(): void {
    this.userService.getAdminUser().subscribe(value => {
      this.currentUser= value;
    },error => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigateByUrl('/main')
    });
  }

}
