import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import {LoaderService} from "./service/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'library';

  constructor(public loaderService: LoaderService) {
  }
}
