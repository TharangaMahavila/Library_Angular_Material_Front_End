import { Injectable } from '@angular/core';
import {Student} from "../model/Student";
import {MatTableDataSource} from "@angular/material/table";
import {newGrade} from "../view/dash-board/student-registration/student-registration.component";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Staff} from "../model/Staff";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  mode = 'separate';
  staff!: Staff[];
  staffCount = 0;
  selectedStaff!: Staff;
  pageIndex: number = 0;
  pageSize: number = 10;
  isFloatingButtonClicked = false;
  buttonCount = 0;
  isValidUsername = true;
  dataSource = new MatTableDataSource<Staff>();
  profileImageUrl = '';

  constructor(private http:HttpClient
              ,private configService: ConfigService) { }

  form: FormGroup = new FormGroup({
    id: new FormControl('',[Validators.required,Validators.minLength(3)]),
    initial: new FormControl(''),
    fname: new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
    lname: new FormControl('',[Validators.minLength(3)]),
    contact: new FormControl('',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^0[1-9][0-9]{8}$')]),
    streetNo: new FormControl(''),
    firstStreet: new FormControl('',[Validators.required,Validators.minLength(3)]),
    secondStreet: new FormControl('',[Validators.required,Validators.minLength(3)]),
    town: new FormControl('',[Validators.minLength(3)]),
    gender: new FormControl('male',[Validators.required]),
    salaryNo: new FormControl(''),
    active: new FormControl(true,[Validators.required]),
    role: new FormControl('STAFF',[Validators.required]),
    image: new FormControl('')
  });

  initializeFormGroup(){
    this.form.setValue({
      id: '',
      initial: '',
      fname: '',
      lname: '',
      contact: '',
      streetNo: '',
      firstStreet: '',
      secondStreet: '',
      town: '',
      gender: 'male',
      salaryNo: '',
      active: true,
      role: 'STAFF',
      image: ''
    });
    this.form.controls['id'].enable();
    this.form.controls['active'].disable();
  }

  populateForm(staff: Staff){
    this.form.setValue({
      id: staff.id,
      initial: staff.initial,
      fname: staff.fname,
      lname: staff.lname,
      contact: staff.contact,
      streetNo: staff.streetNo,
      firstStreet: staff.firstStreet,
      secondStreet: staff.secondStreet,
      town: staff.town,
      gender: staff.gender.toLowerCase(),
      salaryNo: staff.salaryNo,
      active: staff.active,
      role: 'STAFF',
      image: staff.image
    });
    this.form.controls['id'].disable();
    this.form.controls['active'].enable();
  }
  get registerFormControl(){
    return this.form.controls;
  }

  getAllStaffs(pageIndex: number, pageSize:number,status: boolean): Observable<Array<Staff>>{
    return this.http.get<Array<Staff>>(this.configService.BASE_URL+`/api/v1/staffs/status`,{
      params: new HttpParams()
          .set('status',String(status))
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  countAllStaffs(status: boolean):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/staffs/count`,{
      params: new HttpParams()
          .set('status',String(status))
    });
  }

  saveStaff(staff: Staff):Observable<Staff>{
    return this.http.post<Staff>(this.configService.BASE_URL+`/api/v1/staffs`,staff);
  }

  updateStaff(staff: Staff):Observable<Staff>{
    return this.http.put<Staff>(this.configService.BASE_URL+`/api/v1/staffs/${staff.id}`,staff);
  }

  checkAlreadySavedStaff(regNo: string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/staffs/validate/${regNo}`);
  }

  uploadImage(image: File,id: string): Observable<String>{
    const fd = new FormData();
    fd.append('   ',image,image.name);
    return this.http.post(this.configService.BASE_URL+`/api/v1/staffs/image/${id}`,fd,{
      responseType: 'text'
    });
  }

  deleteImage(id: string): Observable<any>{
    return this.http.delete(this.configService.BASE_URL+`/api/v1/staffs/image/${id}`,{
      responseType: 'text'
    });
  }

  searchStaffByNumber(id:string,pageIndex: number, pageSize:number): Observable<Array<Staff>>{
    return this.http.get<Array<Staff>>(this.configService.BASE_URL+`/api/v1/staffs/search`,{
      params: new HttpParams()
          .set('regNo',id)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  searchStaffByName(name:string,pageIndex: number, pageSize:number): Observable<Array<Staff>>{
    return this.http.get<Array<Staff>>(this.configService.BASE_URL+`/api/v1/staffs/search`,{
      params: new HttpParams()
          .set('name',name)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  countStaffByNumber(id: string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/staffs/count`,{
      params: new HttpParams()
          .set('regNo',id)
    });
  }

  countStaffByName(name: string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/staffs/count`,{
      params: new HttpParams()
          .set('name',name)
    });
  }

  advanceSearch(id:string,name:string,grade:string,section:string,year:string,status:string,pageIndex: number, pageSize:number): Observable<Array<Staff>>{
    return this.http.get<Array<Staff>>(this.configService.BASE_URL+`/api/v1/staffs/search`,{
      params: new HttpParams()
          .set('regNo',id)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  countAddedStaffsBetweenPeriod(startDate:string, endDate:string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/staffs/count/between`,{
      params: new HttpParams()
          .set('startDate',startDate)
          .set('endDate',endDate)
    });
  }
}
