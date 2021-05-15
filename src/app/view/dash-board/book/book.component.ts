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
import {Title} from "@angular/platform-browser";
import {BookService} from "../../../service/book.service";
import {BookCustom} from "../../../model/BookCustom";
import {Author} from "../../../model/Author";
import {Supplier} from "../../../model/Supplier";
import {Rack} from "../../../model/Rack";
import {AuthorService} from "../../../service/author.service";
import {SupplierService} from "../../../service/supplier.service";
import {RackService} from "../../../service/rack.service";
import {BookRegistrationComponent} from "../book-registration/book-registration.component";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {


  displayedColumns: string[] = ['RefNo', 'Image', 'Name', 'Year', 'Medium', 'Author', 'Pages'];

  selectedRow!: string;
  panelOpenState = false;
  authors: Array<Author> = [];

  @ViewChild('txtSearchRegNo')
  txtSearchRefNo!: ElementRef;
  @ViewChild('txtSearchName')
  txtSearchName!: ElementRef;

  author!: Author;

  constructor(private dialog: MatDialog
      ,public bookService: BookService
      ,public authorService: AuthorService
      ,public supplierService: SupplierService
      ,public rackService: RackService
      ,private config: ConfigService
      ,private gradeService: GradeService
      ,private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("BNS-All Books")

    this.getAllBooks(this.bookService.pageIndex,this.bookService.pageSize,this.bookService.activeBookTab);
    this.countAllBooks(true);
  }

  getAllBooks(pageIndex: number, pageSize:number, status:boolean): void{
    this.bookService.getAllBooks(pageIndex,pageSize,status).subscribe(value => {
      this.bookService.books = value;
      this.bookService.dataSource.data = value
    }, error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the Books'
      });
    });
  }

  countAllBooks(status: boolean): void{
    this.bookService.countAllBooks(status).subscribe(value => {
      this.bookService.bookCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the Books'
      });
    });
  }

  applyFilterByReferenceNumber(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookService.books.length = 0;
    this.bookService.searchBookByRefNo(filterValue,this.bookService.pageSize,this.bookService.pageIndex).subscribe(value => {
      this.bookService.books = value;
      this.bookService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the books'
      });
    });
    this.bookService.countBookByRefNumber(filterValue).subscribe(value => {
      this.bookService.bookCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the books'
      });
    });
  }

  applyFilterByBookName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookService.books.length = 0;
    this.bookService.searchBookByName(filterValue,this.bookService.pageSize.toString(),this.bookService.pageIndex.toString()).subscribe(value => {
      this.bookService.books = value;
      this.bookService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the books'
      });
    });
    this.bookService.searchBookCountByName(filterValue).subscribe(value => {
      this.bookService.bookCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the books'
      });
    });
  }

  clearSearch(value: string) {
    if (value === null || value === ''){
      this.getAllBooks(this.bookService.pageIndex,this.bookService.pageSize,true);
      this.countAllBooks(true);
    }
  }

  openRegisterForm(){
    this.authorService.selectedItems.length = 0;
    this.supplierService.selectedItems.length = 0;
    this.rackService.selectedItemsRack.length = 0;

    this.bookService.mode = 'add';
    this.bookService.initializeFormGroup();
    this.bookService.profileImageUrl = '';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(BookRegistrationComponent,dialogConfig);
  }

  changePage(event: PageEvent) {
    this.bookService.pageIndex = event.pageIndex;
    this.bookService.pageSize = event.pageSize;
    this.getAllBooks(this.bookService.pageIndex,this.bookService.pageSize,this.bookService.activeBookTab);
    this.bookService.dataSource = new MatTableDataSource<BookCustom>(this.bookService.books);
  }

  getSelectedBook(book: BookCustom): void{
    this.bookService.selectedBook = book;
    this.selectedRow = book.refNo;
  }

  floatingIconClick() {
    this.bookService.isFloatingButtonClicked = true;
    if(this.bookService.buttonCount == 0){
      this.bookService.buttonCount = 1;
    }else {
      this.bookService.buttonCount = 0;
    }
  }

  editRow() {
    this.authorService.selectedItems.push(this.bookService.selectedBook.author);
    this.supplierService.selectedItems.push(this.bookService.selectedBook.supplier);
    this.rackService.selectedItemsRack.push(this.bookService.selectedBook.rackNo);

    this.bookService.populateForm(this.bookService.selectedBook);
    if(this.bookService.selectedBook.image !== null){
      this.bookService.profileImageUrl = `http://localhost:8080/api/v1/books/image/${this.bookService.selectedBook.bookId}`
    }else {
      this.bookService.profileImageUrl = '';
    }
    this.bookService.mode = 'update';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(BookRegistrationComponent,dialogConfig);
  }

  addRow() {
    this.openRegisterForm();
  }

  advanceSearchPanelOpen() {
    this.panelOpenState = true;
  }

  advancedSearch() {
    alert(this.bookService.activeBookTab);
  }

}
