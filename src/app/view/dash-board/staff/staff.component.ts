import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfigService} from "../../../service/config.service";
import {Grade} from "../../../model/Grade";
import {StaffService} from "../../../service/staff.service";
import {StaffRegistrationComponent} from "../staff-registration/staff-registration.component";
import {Staff} from "../../../model/Staff";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Image', 'Name', 'Gender', 'Address', 'Contact'];

  selectedRow!: string;
  panelOpenState = false;

  @ViewChild('txtSearchRegNo')
  txtSearchRegNo!: ElementRef;
  @ViewChild('txtSearchName')
  txtSearchName!: ElementRef;

  status!: boolean;

  constructor(private dialog: MatDialog
      ,public staffService: StaffService
      ,private config: ConfigService) { }

  ngOnInit(): void {

    this.getAllStaff(this.staffService.pageIndex,this.staffService.pageSize,true);
    this.countAllStaff(true);
  }

  getAllStaff(pageIndex: number, pageSize:number, status:boolean): void{
    this.staffService.getAllStaffs(pageIndex,pageSize,status).subscribe(value => {
      this.staffService.staff = value;
      this.staffService.dataSource.data = value
    }, error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the Staff members'
      });
    });
  }

  countAllStaff(status: boolean): void{
    this.staffService.countAllStaffs(status).subscribe(value => {
      this.staffService.staffCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot load the staff members'
      });
    });
  }

  applyFilterByRegisterNumber(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.staffService.staff.length = 0;
    this.staffService.searchStaffByNumber(filterValue,this.staffService.pageIndex,this.staffService.pageSize).subscribe(value => {
      this.staffService.staff = value;
      this.staffService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the staff member'
      });
    });
    this.staffService.countStaffByNumber(filterValue).subscribe(value => {
      this.staffService.staffCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the staff member'
      });
    });
  }

  applyFilterByStaffName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.staffService.staff.length = 0;
    this.staffService.searchStaffByName(filterValue,this.staffService.pageIndex,this.staffService.pageSize).subscribe(value => {
      this.staffService.staff = value;
      this.staffService.dataSource.data = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the staff members'
      });
    });
    this.staffService.countStaffByName(filterValue).subscribe(value => {
      this.staffService.staffCount = value;
    },error => {
      this.config.toastMixin.fire({
        icon: 'error',
        title: 'Cannot search the staff member'
      });
    });
  }

  clearSearch(value: string) {
    if (value === null || value === ''){
      this.getAllStaff(this.staffService.pageIndex,this.staffService.pageSize,true);
      this.countAllStaff(true);
    }
  }

  openRegisterForm(){
    this.staffService.mode = 'add';
    this.staffService.initializeFormGroup();
    this.staffService.profileImageUrl = '';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(StaffRegistrationComponent,dialogConfig);
  }

  changePage(event: PageEvent) {
    this.staffService.pageIndex = event.pageIndex;
    this.staffService.pageSize = event.pageSize;
    this.getAllStaff(this.staffService.pageIndex,this.staffService.pageSize,true);
    this.staffService.dataSource = new MatTableDataSource<Staff>(this.staffService.staff);
  }

  getSelectedStaff(staff: Staff): void{
    this.staffService.selectedStaff = staff;
    this.selectedRow = staff.id;
  }

  floatingIconClick() {
    this.staffService.isFloatingButtonClicked = true
    if(this.staffService.buttonCount == 0){
      this.staffService.buttonCount = 1;
    }else {
      this.staffService.buttonCount = 0;
    }
  }

  editRow() {
    this.staffService.populateForm(this.staffService.selectedStaff);
    if(this.staffService.selectedStaff.image !== null){
      this.staffService.profileImageUrl = `http://localhost:8080/api/v1/staffs/image/${this.staffService.selectedStaff.id}`
    }else {
      this.staffService.profileImageUrl = '';
    }
    this.staffService.mode = 'update';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(StaffRegistrationComponent,dialogConfig);
  }

  addRow() {
    this.openRegisterForm();
  }

  advanceSearchPanelOpen() {
    this.panelOpenState = true;
  }

  advancedSearch() {
    alert(this.status)
  }

}
