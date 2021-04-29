import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookCustom} from '../../model/BookCustom';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BookService} from "../../service/book.service";
import {LoaderService} from "../../service/loader.service";
import Swal from "sweetalert2";
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})

export class SearchResultComponent implements OnInit{

  cards: Array<BookCustom> = [];
  resultCount = 0;
  showResultCount = false
  selectedOption = 'title';
  @ViewChild('search')
  searchValue!: ElementRef;
  @ViewChild('paginator')
  paginator!: MatPaginator;
  panelOpenState = false;

  constructor(private bookService: BookService,public loaderService: LoaderService,
              private config: ConfigService) { }


  ngOnInit(): void {

  }

  searchBook(searchKey: string,pageSize: string, pageIndex: string): void{
    if(this.selectedOption === 'title'){
      this.bookService.searchBookByName(searchKey,pageSize,pageIndex).subscribe(list => {
        this.showResultCount = true;
        this.cards = list;
      }, error => {
        this.config.toastMixin.fire({
          icon: "error",
          animation: true,
          title: 'Failed to load searched data'
        });
      })
      this.bookService.searchBookCountByName(searchKey).subscribe(count => {
        this.resultCount = count;
      }, error => {
        this.config.toastMixin.fire({
          icon: "error",
          animation: true,
          title: 'Failed to load search count'
        });
      });
    }else if(this.selectedOption === 'author'){
      this.bookService.searchBookByAuthor(searchKey,pageSize,pageIndex).subscribe(list => {
        this.showResultCount = true;
        this.cards = list;
      }, error => {
        this.config.toastMixin.fire({
          icon: "error",
          animation: true,
          title: 'Failed to load searched data'
        });
      });
      this.bookService.searchBookCountByAuthor(searchKey).subscribe(count => {
        this.resultCount = count;
      }, error => {
        this.config.toastMixin.fire({
          icon: "error",
          animation: true,
          title: 'Failed to load search count'
        });
      });
    }else {

    }
  }

  changePage(event: PageEvent) {
    this.searchBook((this.searchValue.nativeElement as HTMLInputElement).value
        ,event.pageSize.toString(),event.pageIndex.toString())
  }

  clearSearch(value: string) {
    if (value === null || value === ''){
      this.showResultCount = false;
      this.cards.length = 0;
    }
  }

  searchTypeSelect() {
    if((this.searchValue.nativeElement as HTMLInputElement).value !== ''){
      this.paginator.firstPage();
      this.searchBook((this.searchValue.nativeElement as HTMLInputElement).value,'5','0');
    }
  }

  onSearchCloseButton() {
    (this.searchValue.nativeElement as HTMLInputElement).value = '';
    this.clearSearch((this.searchValue.nativeElement as HTMLInputElement).value);
  }
}

