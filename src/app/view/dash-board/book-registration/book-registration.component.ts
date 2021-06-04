import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {MatDialogRef} from "@angular/material/dialog";
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {AuthorRegistrationComponent} from "./author-registration/author-registration.component";
import {AuthorService} from "../../../service/author.service";
import {ConfigService} from "../../../service/config.service";
import {SupplierRegistrationComponent} from "./supplier-registration/supplier-registration.component";
import {RackRegistrationComponent} from "./rack-registration/rack-registration.component";
import {BookService} from "../../../service/book.service";
import {SupplierService} from "../../../service/supplier.service";
import {RackService} from "../../../service/rack.service";
import {FileItem, FileUploader} from "ng2-file-upload";
import {Grade} from "../../../model/Grade";

const URL = '/api/v1/books/uploadPdf';
@Component({
  selector: 'app-book-registration',
  templateUrl: './book-registration.component.html',
  styleUrls: ['./book-registration.component.scss']
})
export class BookRegistrationComponent implements OnInit {

  dropdownSettings!:IDropdownSettings;
  dropdownSettingsSupplier!:IDropdownSettings;
  dropdownSettingsRack!: IDropdownSettings;
  searchedBook = false;
  mediums: string[] = ['SINHALA','ENGLISH','TAMIL'];

  uploader!:FileUploader;
  hasBaseDropZoneOver!:boolean;
  hasAnotherDropZoneOver!:boolean;
  response!:string;

  @ViewChild('bookId')
  txtBookId!: ElementRef;
  @ViewChild('englishName')
  txtEnglishName!: ElementRef;
  timestamp = new Date().getTime();

  selectedImage!: File;
  popoverTitle: string = 'Delete profile image';
  popoverMessage: string = 'Do you really want to remove the profile image';

  constructor(private dialogRef: MatDialogRef<BookRegistrationComponent>
      ,public bookService: BookService
      ,public supplierService: SupplierService
      ,public rackService: RackService
      ,private bottomSheet: MatBottomSheet
      ,public authorService: AuthorService
      ,public configService: ConfigService) { }


  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettingsSupplier={
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.dropdownSettingsRack={
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    }
    this.getAllAuthors();
    this.getAllSupplier();
    this.getAllrack();

    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item:any) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );

  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onFormClose() {
    this.dialogRef.close();
  }

  submitForm() {
    if(!this.bookService.isValidBookId){
      (this.txtBookId.nativeElement as HTMLInputElement).select();
      return;
    }
    if(this.bookService.form.valid){
      let bookObj = this.bookService.form.value;
      bookObj.author = this.bookService.form.value.author[0].id;

      //add student
      if(this.bookService.mode === 'add' || this.bookService.mode === 'separate'){
        this.bookService.saveBook(bookObj).subscribe(value => {
          if(this.bookService.profileImageUrl !== ''){
            this.uploadProfileImage(this.selectedImage, bookObj.bookId);
          }
          this.closeForm();
          this.configService.toastMixin.fire({
            icon: 'success',
            title: 'Successfully saved the Book'
          });
        },error => {
          this.configService.toastMixin.fire({
            icon: 'error',
            title: 'Failed to save the Book'
          });
        });
        //update student
      }else {
       /* studentObj.regNo = this.studentService.selectedStudent.regNo;
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
        });*/
      }
    }
  }

  onFileSelect(event: Event) {
    // @ts-ignore
    this.selectedImage = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    reader.onload = (e:any) =>{
      this.bookService.profileImageUrl = e.target.result;
    }
  }

  deleteProfileImage(): void {
    this.bookService.profileImageUrl = '';
  }

  editProfilePhoto(): void {
    alert('Edit Profile Image');
  }

  openAuthorBottomSheet(): void {
    this.bottomSheet.open(AuthorRegistrationComponent);
  }

  openCategoryBottomSheet(): void {
    this.bottomSheet.open(AuthorRegistrationComponent);
  }

  openBottomSheetSupplier() {
    this.bottomSheet.open(SupplierRegistrationComponent)
  }

  openBottomSheetRack() {
    this.bottomSheet.open(RackRegistrationComponent)
  }
  getAllAuthors(): void{
    this.authorService.getAllAuthors().subscribe(value => {
      this.authorService.dropdownList = value;
    },error => {
      alert(JSON.stringify(error))
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to load the authors'
      })
    })
  }

  getAllSupplier(): void{
    this.supplierService.getAllSupplier().subscribe(value => {
      this.supplierService.dropdownList = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to load suppliers'
      })
    })
  }

  getAllrack(): void{
    this.rackService.getAllRack().subscribe(value => {
      this.rackService.dropdownListRack = value;
    },error => {
      this.configService.toastMixin.fire({
        icon: 'error',
        title: 'Failed to load rack'
      })
    })
  }

  searchBook(bookId: string) {
    this.searchedBook = !this.searchedBook;
  }

  onItemSelectSupplier(item: any) {
    console.log(item);
  }

  onSelectAllSupplier(items: any) {
    console.log(items);
  }

  onItemSelectRack(item: any) {
    console.log(item);
  }

  onSelectAllRack(items: any) {
    console.log(items);
  }

  submitReferenceForm() {

  }

  singleUpload(item: FileItem) {
    if((this.txtBookId.nativeElement as HTMLInputElement).value.trim() === ''){
      this.configService.toastMixin.fire({
        icon: "warning",
        title: 'First you should fill the "BookId"'
      });
      return;
    }
      this.bookService.uploadPdf(item._file,(this.txtBookId.nativeElement as HTMLInputElement).value.trim()).subscribe(value => {
        item.isSuccess = true;
        item.progress = 100;
        this.calculateQueueProgress();
      },error => {
        item.isError = true;
        item.progress = 0;
      });
  }

  uploadAll() {
    if((this.txtBookId.nativeElement as HTMLInputElement).value.trim() === ''){
      this.configService.toastMixin.fire({
        icon: "warning",
        title: 'First you should fill the "BookId"'
      });
      return;
    }
    for (const fileItem of this.uploader.queue) {
      if(fileItem.progress < 100){
        this.bookService.uploadPdf(fileItem._file,(this.txtBookId.nativeElement as HTMLInputElement).value.trim()).subscribe(value => {
          fileItem.isSuccess = true;
          fileItem.progress = 100;
        },error => {
          fileItem.progress = 0;
          fileItem.isError = true;
        });
      }
    }
    this.calculateQueueProgress();
  }

  calculateQueueProgress(){
    let successItems = 0;
    for (const fileItem of this.uploader.queue) {
      if(fileItem.progress === 100){
        successItems++;
      }
    }
    if(this.uploader.queue.length === 0){
      this.uploader.progress = 0;
      return;
    }
    this.uploader.progress = (100/this.uploader.queue.length)*successItems;
  }

  singleDelete(item: FileItem) {
    if(item.progress < 100){
      item.remove();
      this.calculateQueueProgress();
      return;
    }
    if((this.txtBookId.nativeElement as HTMLInputElement).value.trim() === ''){
      this.configService.toastMixin.fire({
        icon: "warning",
        title: '"BookId" cannot be empty'
      });
      return;
    }
    this.bookService.deletePdf(item._file.name,(this.txtBookId.nativeElement as HTMLInputElement).value.trim()).subscribe(value => {
      item.progress = 0;
      item.remove();
      this.calculateQueueProgress();
    },error => {
      this.configService.toastMixin.fire({
        icon: "error",
        title: 'Something went wrong!'
      });
    });
  }

  deleteAll() {
    let removeList: Array<FileItem> = [];
    for (const item of this.uploader.queue) {
      if(item.progress < 100){
        removeList.push(item);
      }else{
        if((this.txtBookId.nativeElement as HTMLInputElement).value.trim() === ''){
          this.configService.toastMixin.fire({
            icon: "warning",
            title: '"BookId" cannot be empty'
          });
          return;
        }
        this.bookService.deletePdf(item._file.name,(this.txtBookId.nativeElement as HTMLInputElement).value.trim()).subscribe(value => {
          item.progress = 0;
          item.remove();
        },error => {
          this.configService.toastMixin.fire({
            icon: "error",
            title: 'Something went wrong!'
          });
          return;
        });
      }
    }
    for (const fileItem of removeList) {
      fileItem.remove();
    }
    this.calculateQueueProgress();
  }

  validateBookId(id: string){
    this.bookService.checkAlreadySavedBook(id).subscribe(value => {
      if (value === 0){
        this.bookService.isValidBookId = true;
      }else {
        this.bookService.isValidBookId = false;
      }
    });
  }
  uploadProfileImage(image:File, regNo:string){
    this.bookService.uploadImage(image,regNo).subscribe(value1 => {
    });
  }

  closeForm(){
    this.bookService.form.reset();
    this.bookService.initializeFormGroup();
    this.bookService.isFloatingButtonClicked = false;
    this.bookService.buttonCount = 0;
    this.dialogRef.close();
  }
}
