import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    password: new FormControl('',[Validators.required,Validators.pattern('(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$')]),
  });

  get formControl(){
    return this.form.controls;
  }

  deleteProfileImage(): void {
    alert('Delete profile image');
  }

  editProfilePhoto(): void {
    alert('Edit profile image');
  }
}
