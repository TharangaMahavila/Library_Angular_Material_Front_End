import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  //BASE_URL = 'http://139.59.90.226:8080';
  BASE_URL = 'http://localhost:8080';

  constructor(private toastr: ToastrService) { }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
    if(error.status === 400){
      return throwError('Bad request');
    }
    // Return an observable with a user-facing error message.
    return throwError(
        'Something bad happened; please try again later.');
  }

  toastMixin = Swal.mixin({
    toast: true,
    icon: "success",
    title: 'General Title',
    animation: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  showMessage(sender: string, message: string){
    this.toastr.info(
        `<div class="d-flex align-items-center" style="margin-left: 20px; padding-left: 20px">
            <div style="background-color: yellow !important;">
                <div class="message-image"></div>
            </div>
            <div>
            <h6>${sender}</h6>
            <div>${message}</div>
            </div>
        </div>`
        , '',{
      closeButton: true,
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-right',
    });
  }
}
