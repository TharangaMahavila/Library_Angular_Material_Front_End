import { Component, OnInit } from '@angular/core';
import {BookService} from "../../../../service/book.service";
import {Supplier} from "../../../../model/Supplier";
import {ConfigService} from "../../../../service/config.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {SupplierService} from "../../../../service/supplier.service";

@Component({
  selector: 'app-supplier-registration',
  templateUrl: './supplier-registration.component.html',
  styleUrls: ['./supplier-registration.component.scss']
})
export class SupplierRegistrationComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef,
              public bookService: BookService
              ,public supplierService: SupplierService
      ,private configService: ConfigService) { }

  ngOnInit(): void {
  }

  onFormClose(){
    this.bottomSheetRef.dismiss();
  }
  saveSupplier(name: string) {
    if (name!==''){
      for (const supplier of this.supplierService.dropdownList){
        if (supplier.name=== name){
          this.supplierService.isTakenSupplierName=true;
          return
        }
      }

      this.supplierService.saveSupplier(name).subscribe(value => {
        this.supplierService.getAllSupplier().subscribe(value1 => {
          this.supplierService.dropdownList = value1;
          let selectSupplier: Array<Supplier> = [];
          for (const supplier of value1){
            if(supplier.name === name){
              selectSupplier.push(supplier);
              this.supplierService.selectedItems =selectSupplier;
            }
          }
        },error => {
          this.configService.toastMixin.fire({
            icon: 'error',
            title: 'Supplier added,but failed to load'
          });
        });
        this.configService.toastMixin.fire({
          icon: 'success',
          title: 'supplier added'
        });
        this.onFormClose();
      },error => {
        this.configService.toastMixin.fire({
          icon: 'error',
          title: 'Failed to save supplier'
        });
      });
    }
  }
}
