import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthorService} from "../../../../service/author.service";
import {ConfigService} from "../../../../service/config.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Author} from "../../../../model/Author";

@Component({
  selector: 'app-author-registration',
  templateUrl: './author-registration.component.html',
  styleUrls: ['./author-registration.component.scss']
})
export class AuthorRegistrationComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef
      ,public authorService: AuthorService
      ,private configService: ConfigService) { }

  ngOnInit(): void {
  }

  onFormClose() {
    this.bottomSheetRef.dismiss();
  }

  saveAuthor(name: string) {
    if(name !== ''){

      for (const author of this.authorService.dropdownList) {
        if(author.name === name){
          this.authorService.isTakenAuthorName = true;
          return;
        }
      }

      this.authorService.saveAuthor(name).subscribe(value => {
        this.authorService.getAllAuthors().subscribe(value1 => {
          this.authorService.dropdownList = value1;
          let selectedAuthor: Array<Author> = [];
          for (const author of value1) {
            if(author.name === name){
              selectedAuthor.push(author);
              this.authorService.selectedItems = selectedAuthor;
            }
          }
        },error => {
          this.configService.toastMixin.fire({
            icon: 'error',
            title: 'Author added,but failed to load'
          });
        });
        this.configService.toastMixin.fire({
          icon: 'success',
          title: 'Author added'
        });
        this.onFormClose();
      },error => {
        this.configService.toastMixin.fire({
          icon: 'error',
          title: 'Failed to save the author'
        });
      });
    }
  }
}
