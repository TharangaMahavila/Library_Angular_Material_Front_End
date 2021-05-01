import { Component, OnInit } from '@angular/core';
import {Student} from "../../../model/Student";
import {BookCustom} from "../../../model/BookCustom";
import {CartItem} from "../../../model/CartItem";

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  issueBook() {
    alert('issued')
  }


}
