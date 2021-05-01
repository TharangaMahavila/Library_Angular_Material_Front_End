import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {StudentService} from '../../../service/student.service';
import {ConfigService} from "../../../service/config.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {GradeService} from "../../../service/grade.service";
import {Grade} from "../../../model/Grade";
import {Student} from "../../../model/Student";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent implements OnInit {

  dropdownSettings!:IDropdownSettings;
  @ViewChild('regNo')
  regNo!: ElementRef;
  selectedImage!: File;
  popoverTitle: string = 'Delete profile image';
  popoverMessage: string = 'Do you really want to remove the profile image';


  constructor(private dialogRef: MatDialogRef<StudentRegistrationComponent>,
              public studentService: StudentService
              ,private config: ConfigService
              ,private gradeService: GradeService
              ,private _bottomSheet: MatBottomSheet
              ,private titleService: Title) { }


  ngOnInit(): void {
    this.titleService.setTitle("BNS-Student Registration");

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getAllGrades();
  }

  getAllGrades(): void{
    this.gradeService.getAllGrades().subscribe(value => {
      let grades: Array<newGrade> = [];
      for (const grade of value) {
        var obj = {id: grade.id, desc: grade.grade+' '+grade.section+' '+grade.year}
        grades.push(obj);
      }
      this.studentService.dropdownList = grades;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Failed to load the grades'
      });
    });
  }

  deleteProfileImage(): void {
    this.studentService.profileImageUrl = '';
  }

  onFormClose() {
    this.studentService.mode = 'separate';
    this.dialogRef.close();
  }

  submitForm() {
    if(!this.studentService.isValidUsername){
      (this.regNo.nativeElement as HTMLInputElement).select();
      return;
    }
    if(this.studentService.form.valid){
      let studentObj = this.studentService.form.value;
      if(studentObj.gender === 'male' || studentObj.gender === 'female' || this.studentService.mode === 'update'){
        let newGrades = studentObj.grades;
        let grade:Array<Grade> = [];
        for (const newGrade of newGrades) {
          var split = newGrade.desc.split(" ",3);
          let obj = {id:newGrade.id,grade:+split[0],section:split[1],year:+split[2]}
          grade.push(obj);
        }
        if(studentObj.gender === 'male'){
          studentObj.gender = '0';
        }else {
          studentObj.gender = '1';
        }
        studentObj.grades = grade
      }

      //add student
      if(this.studentService.mode === 'add' || this.studentService.mode === 'separate'){
        this.studentService.saveStudent(studentObj).subscribe(value => {
          if(this.studentService.profileImageUrl !== ''){
            this.uploadProfileImage(this.selectedImage, studentObj.regNo);
          }
          this.closeForm();
          this.config.toastMixin.fire({
            icon: 'success',
            title: 'Successfully saved the student'
          });
          this.getAllStudents();
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to save the student'
          });
        });
        //update student
      }else {
        studentObj.regNo = this.studentService.selectedStudent.regNo;
        this.studentService.updateStudent(studentObj).subscribe(value => {
          if(this.studentService.selectedStudent.image !== null && this.studentService.profileImageUrl === ''){
            this.uploadDeletedProfileImage(studentObj.regNo);
          }else if(this.studentService.profileImageUrl !== '' && this.selectedImage !== undefined){
            this.uploadProfileImage(this.selectedImage, studentObj.regNo);
          }
          this.closeForm();
          this.config.toastMixin.fire({
            icon: 'success',
            title: 'Successfully updated the student'
          });
          this.getAllStudents();
          this.studentService.selectedStudent = studentObj;
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to update the student'
          });
        });
      }
    }
  }

  uploadProfileImage(image:File, regNo:string){
    this.studentService.uploadImage(image,regNo).subscribe(value1 => {
    });
  }

  uploadDeletedProfileImage(id: string){
    this.studentService.deleteImage(id).subscribe(value => {

    })
  }

  closeForm(){
    this.studentService.form.reset();
    this.studentService.initializeFormGroup();
    this.studentService.isFloatingButtonClicked = false;
    this.studentService.buttonCount = 0;
    this.dialogRef.close();
  }

  validateUsername(regNo: string){
    this.studentService.checkAlreadySavedStudent(regNo).subscribe(value => {
      if (value === 0){
        this.studentService.isValidUsername = true;
      }else {
        this.studentService.isValidUsername = false;
      }
    });
  }

  onFileSelect(event: Event) {
    // @ts-ignore
    this.selectedImage = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    reader.onload = (e:any) =>{
      this.studentService.profileImageUrl = e.target.result;
    }
  }

  getAllStudents(): void{
    this.studentService.getAllStudents(this.studentService.pageIndex,this.studentService.pageSize,true)
        .subscribe(value1 => {
          this.studentService.students = value1;
          this.studentService.dataSource.data = value1;
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to load the data'
          });
        });
  }

  openBottomSheet() {
    this._bottomSheet.open(StudentRegistrationComponent);
  }
}
export interface newGrade {
  id: number,
  desc: string
}
