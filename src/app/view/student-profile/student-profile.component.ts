import { Component, OnInit } from '@angular/core';
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

    logOut() {
        localStorage.removeItem('token');
    }
}
