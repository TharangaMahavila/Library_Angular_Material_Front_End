import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { StudentRegistrationComponent } from './view/dash-board/student-registration/student-registration.component';
import { MainMenuComponent } from './view/main-menu/main-menu.component';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatOptionModule} from '@angular/material/core';
import { SearchResultComponent } from './view/search-result/search-result.component';
import {MatCardModule} from '@angular/material/card';
import {AppRouterModule} from './app.router.module';
import { FooterComponent } from './view/footer/footer.component';
import {BookService} from "./service/book.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatChipsModule} from "@angular/material/chips";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {InterceptorService} from "./service/interceptor.service";
import { HighlightSearchPipe } from './pipes/highlight-search.pipe';
import { StudentProfileComponent } from './view/student-profile/student-profile.component';
import {TokenInterceptorService} from "./service/token-interceptor.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { DashBoardComponent } from './view/dash-board/dash-board.component';
import { HomeComponent } from './view/dash-board/home/home.component';
import { StudentComponent } from './view/dash-board/student/student.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {MatSelectModule} from "@angular/material/select";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import { StaffComponent } from './view/dash-board/staff/staff.component';
import { StaffRegistrationComponent } from './view/dash-board/staff-registration/staff-registration.component';
import { BookRegistrationComponent } from './view/dash-board/book-registration/book-registration.component';
import { BookComponent } from './view/dash-board/book/book.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {ChartsModule} from "ng2-charts";
import { AuthorRegistrationComponent } from './view/dash-board/book-registration/author-registration/author-registration.component';
import { AddCartWithLogginComponent } from './view/search-result/add-cart-with-loggin/add-cart-with-loggin.component';
import { RackRegistrationComponent } from './view/dash-board/book-registration/rack-registration/rack-registration.component';
import { SupplierRegistrationComponent } from './view/dash-board/book-registration/supplier-registration/supplier-registration.component';
import { SettingComponent } from './view/dash-board/setting/setting.component';
import { StepperComponent } from './view/dash-board/stepper/stepper.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatStepperModule} from "@angular/material/stepper";
import { ToastrModule } from 'ngx-toastr';
import { MatFileUploadModule } from 'angular-material-fileupload';
import {FileUploadModule} from "ng2-file-upload";


@NgModule({
  declarations: [
    AppComponent,
    StudentRegistrationComponent,
    MainMenuComponent,
    SearchResultComponent,
    FooterComponent,
    HighlightSearchPipe,
    StudentProfileComponent,
    DashBoardComponent,
    HomeComponent,
    StudentComponent,
    StaffComponent,
    StaffRegistrationComponent,
    BookRegistrationComponent,
    BookComponent,
    AuthorRegistrationComponent,
    AddCartWithLogginComponent,
    RackRegistrationComponent,
    SupplierRegistrationComponent,
    SettingComponent,
    StepperComponent,
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MDBBootstrapModule.forRoot(),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatOptionModule,
    MatCardModule,
    AppRouterModule,
    MatDialogModule,
    HttpClientModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    NgMultiSelectDropDownModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    MatSelectModule,
    MatBottomSheetModule,
    ChartsModule,
    MatTabsModule,
    MatStepperModule,
    MatFileUploadModule,
    ToastrModule.forRoot(),
    FileUploadModule
  ],
  providers: [BookService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:InterceptorService,
      multi:true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [StudentRegistrationComponent]
})
export class AppModule { }

