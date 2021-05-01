import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookRegistrationComponent} from "../book-registration.component";
import {BookService} from "../../../../service/book.service";
import {ConfigService} from "../../../../service/config.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {RackService} from "../../../../service/rack.service";

@Component({
  selector: 'app-rack-registration',
  templateUrl: './rack-registration.component.html',
  styleUrls: ['./rack-registration.component.scss']
})
export class RackRegistrationComponent implements OnInit {

  @ViewChild('rackNo')
  rackNo!: ElementRef

  constructor(public bookService: BookService
      ,public rackService: RackService
      ,private configService: ConfigService
      ,private bottomSheetRef: MatBottomSheetRef) { }

  ngOnInit(): void {
  }

  saveRack(rackNo: string,shellNo: string) {
    for (const rack of this.rackService.dropdownListRack) {
      if(rackNo === rack.rackNo && shellNo === rack.shellNo){
        this.rackService.isTakenRackNo = true;
        (this.rackNo.nativeElement as HTMLInputElement).focus();
        return;
      }
    }
    this.rackService.saveRack(rackNo,shellNo).subscribe(value => {
      this.rackService.getAllRack().subscribe(value1 => {
        this.rackService.dropdownListRack = value1;
      });
      for (const rack of this.rackService.dropdownListRack) {
        if(rackNo === rack.rackNo && shellNo === rack.shellNo){
          this.rackService.selectedItemsRack.push(rack);
        }
      }
      this.onFormClose();
      this.configService.toastMixin.fire({
        icon: "success",
        title: "Rack Saved"
      });
    },error => {
      this.configService.toastMixin.fire({
        icon: "error",
        title: "Failed to save the rack"
      });
    });
  }

  onFormClose(){
    this.bottomSheetRef.dismiss();
  }
}
