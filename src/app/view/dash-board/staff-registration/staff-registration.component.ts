import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from "../../../service/config.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {StaffService} from "../../../service/staff.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-staff-registration',
  templateUrl: './staff-registration.component.html',
  styleUrls: ['./staff-registration.component.scss']
})
export class StaffRegistrationComponent implements OnInit {

  @ViewChild('regNo')
  regNo!: ElementRef;
  selectedImage!: File;
  popoverTitle: string = 'Delete profile image';
  popoverMessage: string = 'Do you really want to remove the profile image';


  constructor(private dialogRef: MatDialogRef<StaffRegistrationComponent>,
              public staffService: StaffService
      ,private config: ConfigService
      ,private _bottomSheet: MatBottomSheet
      ,private titleService: Title) { }


  ngOnInit(): void {
    this.titleService.setTitle("BNS-Staff Registration");
  }

  deleteProfileImage(): void {
    this.staffService.profileImageUrl = '';
  }

  onFormClose() {
    this.staffService.mode = 'separate';
    this.dialogRef.close();
  }

  submitForm() {
    if(!this.staffService.isValidUsername){
      (this.regNo.nativeElement as HTMLInputElement).select();
      return;
    }
    if(this.staffService.form.valid){
      let staffObj = this.staffService.form.value;
      if(staffObj.gender === 'male' || staffObj.gender === 'female' || this.staffService.mode === 'update'){
        if(staffObj.gender === 'male'){
          staffObj.gender = '0';
        }else {
          staffObj.gender = '1';
        }
      }

      //add staff
      if(this.staffService.mode === 'add' || this.staffService.mode === 'separate'){
        this.staffService.saveStaff(staffObj).subscribe(value => {
          this.uploadProfileImage(this.selectedImage, staffObj.id);
          this.closeForm();
          this.config.toastMixin.fire({
            icon: 'success',
            title: 'Successfully saved the staff member'
          });
          this.getAllStaffs();
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to save the staff member'
          });
        });
        //update staff
      }else {
        staffObj.id = this.staffService.selectedStaff.id;
        this.staffService.updateStaff(staffObj).subscribe(value => {
          if(this.staffService.selectedStaff.image !== null && this.staffService.profileImageUrl === ''){
            this.uploadDeletedProfileImage(staffObj.id);
          }else if(this.staffService.profileImageUrl !== '' && this.selectedImage !== undefined){
            this.uploadProfileImage(this.selectedImage, staffObj.id);
          }
          this.closeForm();
          this.config.toastMixin.fire({
            icon: 'success',
            title: 'Successfully updated the staff member'
          });
          this.getAllStaffs();
          this.staffService.selectedStaff = staffObj;
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to update the staff member'
          });
        });
      }
    }
  }

  uploadProfileImage(image:File, regNo:string){
    this.staffService.uploadImage(image,regNo).subscribe(value1 => {
    });
  }

  uploadDeletedProfileImage(id: string){
    this.staffService.deleteImage(id).subscribe(value => {

    })
  }

  closeForm(){
    this.staffService.form.reset();
    this.staffService.initializeFormGroup();
    this.staffService.isFloatingButtonClicked = false;
    this.staffService.buttonCount = 0;
    this.dialogRef.close();
  }

  validateUsername(regNo: string){
    this.staffService.checkAlreadySavedStaff(regNo).subscribe(value => {
      if (value === 0){
        this.staffService.isValidUsername = true;
      }else {
        this.staffService.isValidUsername = false;
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
      this.staffService.profileImageUrl = e.target.result;
    }
  }

  getAllStaffs(): void{
    this.staffService.getAllStaffs(this.staffService.pageIndex,this.staffService.pageSize,true)
        .subscribe(value1 => {
          this.staffService.staff = value1;
          this.staffService.dataSource.data = value1;
        },error => {
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Failed to load the data'
          });
        });
  }

}
