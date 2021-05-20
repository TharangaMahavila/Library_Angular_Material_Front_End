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
  mediums: string[] = ['Sinhala','English','Tamil'];

  uploader!:FileUploader;
  hasBaseDropZoneOver!:boolean;
  hasAnotherDropZoneOver!:boolean;
  response!:string;

  @ViewChild('bookId')
  txtBookId!: ElementRef;
  @ViewChild('englishName')
  txtEnglishName!: ElementRef;
  timestamp = new Date().getTime();

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
    if (this.bookService.form.valid){
      let studentObj = this.bookService.form.value;
    }
  }

  deleteProfileImage(): void {
    alert('Delete Profile Image');
  }

  editProfilePhoto(): void {
    alert('Edit Profile Image');
  }

  openBottomSheet(): void {
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
      });
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
}
