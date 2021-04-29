import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {newGrade, StudentRegistrationComponent} from '../student-registration/student-registration.component';
import {Student} from '../../../model/Student'
import {StudentService} from "../../../service/student.service";
import {ConfigService} from "../../../service/config.service";
import {Grade} from "../../../model/Grade";
import {GradeService} from "../../../service/grade.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  displayedColumns: string[] = ['RegNo', 'Image', 'Name', 'Gender', 'Grade', 'Address', 'Contact'];

  selectedRow!: string;
  panelOpenState = false;
  grades: Array<number> = [];
  sections: Array<string> = [];
  years: Array<number> = [];

  @ViewChild('txtSearchRegNo')
  txtSearchRegNo!: ElementRef;
  @ViewChild('txtSearchName')
  txtSearchName!: ElementRef;

  grade!: number;
  section!: string;
  year!: number;
  status!: boolean;

  constructor(private dialog: MatDialog
              ,public studentService: StudentService
              ,private config: ConfigService
              ,private gradeService: GradeService) { }

  ngOnInit(): void {

    this.getAllStudent(this.studentService.pageIndex,this.studentService.pageSize,true);
    this.countAllStudents(true);
  }

  getAllStudent(pageIndex: number, pageSize:number, status:boolean): void{
    this.studentService.getAllStudents(pageIndex,pageSize,status).subscribe(value => {
      this.studentService.students = value;
      this.studentService.dataSource.data = value
    }, error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the students'
      });
    });
  }

  countAllStudents(status: boolean): void{
    this.studentService.countAllStudents(status).subscribe(value => {
      this.studentService.studentCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the students'
      });
    });
  }

  applyFilterByRegisterNumber(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.studentService.students.length = 0;
    this.studentService.searchStudentByNumber(filterValue,this.studentService.pageIndex,this.studentService.pageSize).subscribe(value => {
      this.studentService.students = value;
      this.studentService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the students'
      });
    });
    this.studentService.countStudentByNumber(filterValue).subscribe(value => {
      this.studentService.studentCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the students'
      });
    });
  }

  applyFilterByStudentName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.studentService.students.length = 0;
    this.studentService.searchStudentByName(filterValue,this.studentService.pageIndex,this.studentService.pageSize).subscribe(value => {
      this.studentService.students = value;
      this.studentService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the students'
      });
    });
    this.studentService.countStudentByName(filterValue).subscribe(value => {
      this.studentService.studentCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the students'
      });
    });
  }

  clearSearch(value: string) {
    if (value === null || value === ''){
      this.getAllStudent(this.studentService.pageIndex,this.studentService.pageSize,true);
      this.countAllStudents(true);
    }
  }

  openRegisterForm(){
    this.studentService.selectedItems.length = 0;
    this.studentService.mode = 'add';
    this.studentService.initializeFormGroup();
    this.studentService.profileImageUrl = '';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(StudentRegistrationComponent,dialogConfig);
  }

  changePage(event: PageEvent) {
    this.studentService.pageIndex = event.pageIndex;
    this.studentService.pageSize = event.pageSize;
    this.getAllStudent(this.studentService.pageIndex,this.studentService.pageSize,true);
    this.studentService.dataSource = new MatTableDataSource<Student>(this.studentService.students);
  }

  getSelectedStudent(student: Student): void{
    this.studentService.selectedStudent = student;
    this.selectedRow = student.regNo;
  }

  floatingIconClick() {
    this.studentService.isFloatingButtonClicked = true
    if(this.studentService.buttonCount == 0){
      this.studentService.buttonCount = 1;
    }else {
      this.studentService.buttonCount = 0;
    }
  }

  editRow() {
    let grades: Array<newGrade> = [];
    for (const grade of this.studentService.selectedStudent.grades) {
      var obj = {id: grade.id, desc: grade.grade+' '+grade.section+' '+grade.year}
      grades.push(obj);
    }
    this.studentService.selectedItems = grades;
    this.studentService.populateForm(this.studentService.selectedStudent);
    if(this.studentService.selectedStudent.image !== null){
      this.studentService.profileImageUrl = `http://localhost:8080/api/v1/students/image/${this.studentService.selectedStudent.regNo}`
    }else {
      this.studentService.profileImageUrl = '';
    }
    this.studentService.mode = 'update';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(StudentRegistrationComponent,dialogConfig);
  }

  addRow() {
    this.openRegisterForm();
  }

  advanceSearchPanelOpen() {
    this.panelOpenState = true;
    this.gradeService.getAllGrades().subscribe(value => {

      this.grades.length = 0;
      this.sections.length = 0;
      this.years.length = 0;

      for (const grade of value) {
        this.grades.push(grade.grade);
        this.sections.push(grade.section);
        this.years.push(grade.year);
      }
    });
  }

  advancedSearch() {
    alert(this.status)
  }
}
