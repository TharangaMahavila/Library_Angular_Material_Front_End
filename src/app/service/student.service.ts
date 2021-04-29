import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Student} from "../model/Student";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {newGrade} from "../view/dash-board/student-registration/student-registration.component";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  mode = 'separate';
  students!: Student[];
  studentCount = 0;
  selectedStudent!: Student;
  pageIndex: number = 0;
  pageSize: number = 10;
  isFloatingButtonClicked = false;
  buttonCount = 0;
  isValidUsername = true;
  dataSource = new MatTableDataSource<Student>();
  profileImageUrl = '';

  dropdownList: Array<newGrade> = [];
  selectedItems: Array<newGrade> = [];

  constructor(private http:HttpClient
              ,private config:ConfigService) { }

  form: FormGroup = new FormGroup({
    regNo: new FormControl('',[Validators.required,Validators.minLength(3)]),
    initial: new FormControl(''),
    fname: new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
    lname: new FormControl('',[Validators.minLength(3)]),
    guardianName: new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z][a-zA-z]+')]),
    streetNo: new FormControl(''),
    firstStreet: new FormControl('',[Validators.required,Validators.minLength(3)]),
    secondStreet: new FormControl('',[Validators.required,Validators.minLength(3)]),
    town: new FormControl('',[Validators.minLength(3)]),
    gender: new FormControl('male',[Validators.required]),
    contact: new FormControl('',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^0[1-9][0-9]{8}$')]),
    active: new FormControl(true,[Validators.required]),
    role: new FormControl('STUDENT',[Validators.required]),
    grades: new FormControl([],[Validators.required]),
    image: new FormControl('')
  });

  initializeFormGroup(){
    this.form.setValue({
      regNo: '',
      initial: '',
      fname: '',
      lname: '',
      guardianName: '',
      streetNo: '',
      firstStreet: '',
      secondStreet: '',
      town: '',
      gender: 'male',
      contact: '',
      active: true,
      role: 'STUDENT',
      grades: [],
      image: ''
    });
    this.form.controls['regNo'].enable();
    this.form.controls['active'].disable();
  }

  populateForm(student: Student){
    this.form.setValue({
      regNo: student.regNo,
      initial: student.initial,
      fname: student.fname,
      lname: student.lname,
      guardianName: student.guardianName,
      streetNo: student.streetNo,
      firstStreet: student.firstStreet,
      secondStreet: student.secondStreet,
      town: student.town,
      gender: student.gender.toLowerCase(),
      contact: student.contact,
      active: student.active,
      role: 'STUDENT',
      grades: [],
      image: student.image
    });
    this.form.controls['regNo'].disable();
    this.form.controls['active'].enable();
  }
  get registerFormControl(){
    return this.form.controls;
  }

  getAllStudents(pageIndex: number, pageSize:number,status: boolean): Observable<Array<Student>>{
    return this.http.get<Array<Student>>(this.config.BASE_URL+`/api/v1/students/status`,{
       params: new HttpParams()
           .set('status',String(status))
           .set('size',pageSize.toString())
           .set('page',pageIndex.toString())
           .set('sort','createdAt,desc')
    });
  }

  countAllStudents(status: boolean):Observable<number>{
    return this.http.get<number>(this.config.BASE_URL+`/api/v1/students/count`,{
      params: new HttpParams()
          .set('status',String(status))
    });
  }

  countTodayAddedStudents(startDate:string, endDate:string):Observable<number>{
    return this.http.get<number>(this.config.BASE_URL+`/api/v1/students/count/between`,{
      params: new HttpParams()
          .set('startDate',startDate)
          .set('endDate', endDate)
    });
  }

  saveStudent(student: Student):Observable<Student>{
    return this.http.post<Student>(this.config.BASE_URL+`/api/v1/students`,student);
  }

  updateStudent(student: Student):Observable<Student>{
    return this.http.put<Student>(this.config.BASE_URL+`/api/v1/students/${student.regNo}`,student);
  }

  checkAlreadySavedStudent(regNo: string):Observable<number>{
    return this.http.get<number>(this.config.BASE_URL+`/api/v1/students/validate/${regNo}`);
  }

  uploadImage(image: File,id: string): Observable<String>{
    const fd = new FormData();
    fd.append('file',image,image.name);
    return this.http.post<String>(this.config.BASE_URL+`/api/v1/students/image/${id}`,fd);
  }

  deleteImage(id: string): Observable<any>{
    return this.http.delete(this.config.BASE_URL+`/api/v1/students/image/${id}`);
  }

  searchStudentByNumber(id:string,pageIndex: number, pageSize:number): Observable<Array<Student>>{
    return this.http.get<Array<Student>>(this.config.BASE_URL+`/api/v1/students/search`,{
      params: new HttpParams()
          .set('regNo',id)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  searchStudentByName(name:string,pageIndex: number, pageSize:number): Observable<Array<Student>>{
    return this.http.get<Array<Student>>(this.config.BASE_URL+`/api/v1/students/search`,{
      params: new HttpParams()
          .set('name',name)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  countStudentByNumber(id: string):Observable<number>{
    return this.http.get<number>(this.config.BASE_URL+`/api/v1/students/count`,{
      params: new HttpParams()
          .set('regNo',id)
    });
  }

  countStudentByName(name: string):Observable<number>{
    return this.http.get<number>(this.config.BASE_URL+`/api/v1/students/count`,{
      params: new HttpParams()
          .set('name',name)
    });
  }

  advanceSearch(id:string,name:string,grade:string,section:string,year:string,status:string,pageIndex: number, pageSize:number): Observable<Array<Student>>{
    return this.http.get<Array<Student>>(this.config.BASE_URL+`/api/v1/students/search`,{
      params: new HttpParams()
          .set('regNo',id)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }
}
