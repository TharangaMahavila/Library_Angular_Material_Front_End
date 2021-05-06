import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookCustom} from '../../model/BookCustom';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BookService} from "../../service/book.service";
import {LoaderService} from "../../service/loader.service";
import Swal from "sweetalert2";
import {ConfigService} from "../../service/config.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AddCartWithLogginComponent} from "./add-cart-with-loggin/add-cart-with-loggin.component";
import {UserService} from "../../service/user.service";
import {CartService} from "../../service/cart.service";

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

  constructor(private bookService: BookService
              ,public loaderService: LoaderService
              ,private config: ConfigService
              ,public bottomSheet: MatBottomSheet
              ,private userService: UserService
              ,private cartService: CartService) { }


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

  openBottomSheet(bookCustom: BookCustom): void {
    if(this.userService.currentStudentUser === undefined && this.userService.currentStaffUser === undefined){
      this.bookService.selectedBook = bookCustom;
      this.bottomSheet.open(AddCartWithLogginComponent);
    }else{
      for (const cartItem of this.cartService.cartItems) {
        if(cartItem.bookCustomEntity.refNo === bookCustom.refNo){
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Already added to your cart'
          });
          return;
        }
      }
      if(this.cartService.cartItems.length >= 10){
        this.config.toastMixin.fire({
          icon: 'error',
          title: 'Your cart is full, Please clear and try again!'
        });
        return;
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to add "'+bookCustom.englishName+'" to your cart?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Add'
      }).then((result) => {
        if (result.isConfirmed) {
          let userId = (this.userService.currentStudentUser !== undefined) ? this.userService.currentStudentUser.regNo : this.userService.currentStaffUser.id;
          this.cartService.addCartItem(userId,bookCustom.refNo).subscribe(value => {
            Swal.fire(
                'Added!',
                'One item has been added to your cart',
                'success'
            );
            this.cartService.cartItems.push({
              userId: userId,
              bookCustomEntity: bookCustom,
              requestedAt: new Date(),
              requestStatus: false
            });
          },error => {
            Swal.fire(
                'Failed!',
                'Failed to add your cart item',
                'error'
            );
          });
        }
      });
    }
  }
}

