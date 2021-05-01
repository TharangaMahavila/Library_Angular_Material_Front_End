import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookService} from "../../../service/book.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {ConfigService} from "../../../service/config.service";
import {LoaderService} from "../../../service/loader.service";

@Component({
  selector: 'app-add-cart-with-loggin',
  templateUrl: './add-cart-with-loggin.component.html',
  styleUrls: ['./add-cart-with-loggin.component.scss']
})
export class AddCartWithLogginComponent implements OnInit {

  @ViewChild('frm')
  frm!: FormGroup;
  @ViewChild('username')
  txtUsername!: ElementRef;
  @ViewChild('password')
  txtPassword!: ElementRef;

  constructor(public bookService: BookService,
              private fb: FormBuilder
      ,private userService: UserService
      ,private router: Router
      ,private config: ConfigService
      ,public loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    username: new FormControl('',[Validators.required,Validators.minLength(3)]),
    password: new FormControl('',[Validators.required]),
  });

  get formControl(){
    return this.form.controls;
  }

  submitFormData(username:string, password:string): void {
    if(this.form.valid){
      this.userService.authenticate(username, password).subscribe(value => {
        localStorage.setItem(`token`,value);
        this.userService.getUser().subscribe(user => {
          localStorage.setItem(`role`,user.role.toLowerCase());
          if(user.username.toLowerCase()==='admin'){
            this.router.navigateByUrl('/dash-board');
          }else {
            this.router.navigateByUrl('/student-profile');
          }
        },error => {
          this.router.navigateByUrl('/main');
        });
      },error => {
        if(error.status === 401){
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Invalid username or password'
          });
        }else if(error.status === 403){
          this.config.toastMixin.fire({
            icon: 'warning',
            title: 'You are deactivated.please contact the admin'
          });
        }else{
          this.config.toastMixin.fire({
            icon: 'error',
            title: 'Oops! Something went wrong'
          });
        }
        this.frm.reset();
        (this.txtUsername.nativeElement as HTMLInputElement).focus();
      });
    }
  }

}
