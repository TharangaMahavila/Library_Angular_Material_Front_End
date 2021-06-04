import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {BookCustom} from "../model/BookCustom";
import {catchError, retry} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfigService} from "./config.service";
import {Student} from "../model/Student";
import {Book} from "../model/Book";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  mode = 'separate';
  books!: BookCustom[];
  bookCount = 0;
  selectedBook!: BookCustom;
  pageIndex: number = 0;
  pageSize: number = 10;
  isFloatingButtonClicked = false;
  buttonCount = 0;
  activeBookTab = true;
  isValidBookId = true;
  dataSource = new MatTableDataSource<BookCustom>();
  profileImageUrl = '';

  constructor(private http:HttpClient,private configService: ConfigService) { }

  form: FormGroup = new FormGroup({
    bookId: new FormControl('',[Validators.required]),
    englishName: new FormControl('',[Validators.required]),
    sinhalaName: new FormControl('',[Validators.required]),
    year: new FormControl('',[Validators.pattern('^[12][0-9]{3}$')]),
    price: new FormControl('',[Validators.pattern('^[0-9]*$')]),
    medium: new FormControl('SINHALA',[Validators.required]),
    pages: new FormControl('',[Validators.pattern('^[0-9]*$')]),
    note: new FormControl(''),
    image: new FormControl(''),
    author: new FormControl('',[Validators.required]),
    categories: new FormControl('',[Validators.required]),
  });

  get bookRegisterFormControl(){
    return this.form.controls;
  }

  referanceForm: FormGroup = new FormGroup({
    refNo: new FormControl('',[Validators.required]),
    barcode: new FormControl('',[Validators.required]),
    bookId: new FormControl('',[Validators.required]),
    supplier: new FormControl('',[Validators.required]),
    rackNo: new FormControl('',[Validators.required]),
    isReference: new FormControl(false, [Validators.required]),
    isNotDisposed: new FormControl(true, [Validators.required]),
  });

  get bookReferanceFormControl(){
    return this.referanceForm.controls;
  }

  getAllBooks(pageIndex: number, pageSize:number,status: boolean): Observable<Array<BookCustom>>{
    return this.http.get<Array<BookCustom>>(this.configService.BASE_URL+`/api/v1/books/allBooks`,{
      params: new HttpParams()
          .set('status',String(status))
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
          .set('sort','createdAt,desc')
    });
  }

  searchBookByName(searchKey: string,pageSize: string, pageIndex: string):Observable<Array<BookCustom>>{
    return this.http.get<Array<BookCustom>>(this.configService.BASE_URL+`/api/v1/books/searchByName`,{
      params: new HttpParams()
          .set('name',searchKey)
          .set('size',pageSize)
          .set('page',pageIndex)
    }).pipe(
        retry(3),
        catchError(this.configService.handleError)
    );
  }

  searchBookByRefNo(searchKey: string,pageSize: number, pageIndex: number):Observable<Array<BookCustom>>{
    return this.http.get<Array<BookCustom>>(this.configService.BASE_URL+`/api/v1/books/searchByRefNo`,{
      params: new HttpParams()
          .set('name',searchKey)
          .set('size',pageSize.toString())
          .set('page',pageIndex.toString())
    });
  }

  countBookByRefNumber(id: string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/count`,{
      params: new HttpParams()
          .set('refNo',id)
    });
  }

  searchBookByAuthor(searchKey: string,pageSize: string, pageIndex: string):Observable<Array<BookCustom>>{
    return this.http.get<Array<BookCustom>>(this.configService.BASE_URL+`/api/v1/books/searchByAuthor`,{
      params: new HttpParams()
          .set('name',searchKey)
          .set('size',pageSize)
          .set('page',pageIndex)
    });
  }

  countAllBooks(status: boolean):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/count`,{
      params: new HttpParams()
          .set('status',String(status))
    });
  }

  countAddedBooksBetweenPeriod(startDate:string, endDate:string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/count/between`,{
      params: new HttpParams()
          .set('startDate',startDate)
          .set('endDate',endDate)
    });
  }

  searchBookCountByName(searchKey: string): Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/searchCountByName`,{
      params: new HttpParams()
          .set('name',searchKey)
    });
  }

  searchBookCountByAuthor(searchKey: string): Observable<number> {
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/searchCountByAuthor`, {
      params: new HttpParams()
          .set('name', searchKey)
    });
  }

  uploadPdf(pdf: File,id: string): Observable<String>{
    const fd = new FormData();
    fd.append('pdf',pdf,pdf.name);
    return this.http.post(this.configService.BASE_URL+`/api/v1/books/uploadPdf/${id}`,fd,{
      responseType: 'text'
    });
  }

  deletePdf(pdfName: string,id: string): Observable<String>{
    return this.http.delete(this.configService.BASE_URL+`/api/v1/books/deletePdf/${id}`,{
      params: new HttpParams().set('pdf',pdfName),
      responseType: 'text'
    });
  }

  uploadImage(image: File,id: string): Observable<String>{
    const fd = new FormData();
    fd.append('file',image,image.name);
    return this.http.post(this.configService.BASE_URL+`/api/v1/books/image/${id}`,fd,{
      responseType: 'text'
    });
  }

  deleteImage(id: string): Observable<any>{
    return this.http.delete(this.configService.BASE_URL+`/api/v1/books/image/${id}`,{
      responseType: 'text'
    });
  }

  checkAlreadySavedBook(bookId: string):Observable<number>{
    return this.http.get<number>(this.configService.BASE_URL+`/api/v1/books/validate/${bookId}`);
  }

  saveBook(book: Book):Observable<Book>{
    return this.http.post<Book>(this.configService.BASE_URL+`/api/v1/books`,book);
  }

  initializeFormGroup(){
    this.form.setValue({
      bookId: '',
      englishName: '',
      sinhalaName: '',
      year: '',
      price: '',
      medium: 'SINHALA',
      pages: '',
      note: '',
      image: '',
      author: '',
      categories: '',
    });
    this.referanceForm.setValue({
      refNo: '',
      barcode: '',
      bookId: '',
      supplier: '',
      rackNo: '',
      isReference: false,
      isNotDisposed: true
    });
    this.referanceForm.controls['isNotDisposed'].disable();
  }

  populateForm(book: BookCustom){
    this.form.setValue({
      bookId: book.bookId,
      englishName: book.englishName,
      sinhalaName: book.sinhalaName,
      year: book.year,
      price: book.price,
      medium: book.medium,
      pages: book.pages,
      note: book.note,
      image: book.image,
      author: book.author,
      categories: book.categories,
    });
    this.referanceForm.setValue({
      refNo: book.refNo,
      barcode: book.barcode,
      bookId: book.bookId,
      supplier: book.supplier,
      rackNo: book.rackNo,
      isReference: book.reference,
      isNotDisposed: this.activeBookTab
    });
    this.form.controls['bookId'].disable();
    this.referanceForm.controls['refNo'].disable();
    this.referanceForm.controls['isNotDisposed'].enable();
  }
}
