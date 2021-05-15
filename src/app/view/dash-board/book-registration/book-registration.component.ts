import {Component, Input, OnInit} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {newGrade} from "../student-registration/student-registration.component";
import {Author} from "../../../model/Author";
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

  constructor(private dialogRef: MatDialogRef<BookRegistrationComponent>
      ,public bookService: BookService
      ,public supplierService: SupplierService
      ,public rackService: RackService
      ,private bottomSheet: MatBottomSheet
      ,public authorService: AuthorService
      ,private configService: ConfigService) { }


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
}
