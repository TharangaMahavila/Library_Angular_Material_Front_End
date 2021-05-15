import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookService} from "../../../service/book.service";
import {ConfigService} from "../../../service/config.service";
import {StudentService} from "../../../service/student.service";
import {StaffService} from "../../../service/staff.service";
import {Student} from "../../../model/Student";
import {Router} from "@angular/router";
import {ChartType} from "chart.js";
import {Title} from "@angular/platform-browser";
import {MessageService} from "../../../service/message.service";

@Component({
  selector: 'app-main',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allBookCount = 0;
  allStudentCount = 0;
  allStaffCount = 0;
  todayAddedStudents = 0;
  todayAddedBooks = 0;
  todayAddedStaffs = 0;
  recentStudents: Array<Student> = [];
  today = new Date().toString().slice(0,15);
  beforeMonth = this.getBeforeWeek().toString().slice(0,15);
  messages: Array<string> = [];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }
  barChartLabels = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  barChartData = [
    {data: [20,65,55,75,93], label: 'Last Month'},
    {data: [42,25,78,68,45], label: 'This Month'},
  ];
  barChartLegend = true;
  barChartType:ChartType = 'bar';

  @ViewChild('message')
  txtMessage!: ElementRef

  constructor(private bookService: BookService
              ,public configService: ConfigService
              ,private studentService: StudentService
              ,private staffService: StaffService
              ,private router: Router
              ,private titleService: Title
              ,private messageService: MessageService) { }

  ngOnInit(): void {
    this.titleService.setTitle("BNS-Dashboard");

    this.countAllBooksByStatus(true);
    this.countAllStudentsByStatus(true);
    this.getRecentStudents();
    this.countTodayAddedStudents();
    this.countTodayAddedBooks();
    this.countTodayAddedStaffs();

    this.bookIssueChart();
  }

  countAllBooksByStatus(status: boolean): void{
    this.bookService.countAllBooks(status).subscribe(value => {
      this.allBookCount = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count all books'
      });
    });
  }

  getBeforeWeek(): Date{
    var today = new Date();
    today.setDate(today.getDate()-7);
    return today;
  }

  countAllStudentsByStatus(status: boolean): void{
    this.studentService.countAllStudents(status).subscribe(value => {
      this.allStudentCount = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count all students'
      });
    });
  }

  countAllStaffsByStatus(status: boolean): void{
    this.staffService.countAllStaffs(status).subscribe(value => {
      this.allStaffCount = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count all staff members'
      });
    });
  }

  getRecentStudents(): void{
    this.studentService.getAllStudents(0,8,true).subscribe(value => {
      this.recentStudents = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to load recent students'
      });
    });
  }

  countTodayAddedStudents(): void{
    var today = new Date();
    today.setHours(0,0,0,0);
    var tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate()+1);
    this.studentService.countTodayAddedStudents(today.getTime().toString(),tommorow.getTime().toString()).subscribe(value => {
      this.todayAddedStudents = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count today added students'
      });
    });
  }

  countTodayAddedBooks(): void{
    var today = new Date();
    today.setHours(0,0,0,0);
    var tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate()+1);
    this.bookService.countAddedBooksBetweenPeriod(today.getTime().toString(),tommorow.getTime().toString()).subscribe(value => {
      this.todayAddedBooks = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count today added books'
      });
    });
  }

  countTodayAddedStaffs(): void{
    var today = new Date();
    today.setHours(0,0,0,0);
    var tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate()+1);
    this.staffService.countAddedStaffsBetweenPeriod(today.getTime().toString(),tommorow.getTime().toString()).subscribe(value => {
      this.todayAddedStaffs = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to count today added staff members'
      });
    });
  }

  bookIssueChart(): void{

  }

  sendMessage(message: string) {
    if(message !== ''){
      this.messageService.sendCommonMessage(message).subscribe(value => {
        (this.txtMessage.nativeElement as HTMLInputElement).value = '';
        this.messages.push(message);
      },error => {
        this.configService.toastMixin.fire({
          icon: "error",
          title: 'Something went wrong'
        })
      });
    }
  }
}
