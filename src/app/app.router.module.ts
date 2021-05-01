import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainMenuComponent} from './view/main-menu/main-menu.component';
import {StudentRegistrationComponent} from './view/dash-board/student-registration/student-registration.component';
import {SearchResultComponent} from './view/search-result/search-result.component';
import {DashBoardComponent} from './view/dash-board/dash-board.component';
import {FooterComponent} from "./view/footer/footer.component";
import {StudentProfileComponent} from "./view/student-profile/student-profile.component";
import {MainMenuGuard} from "./guards/main-menu.guard";
import {DashboardGuard} from "./guards/dashboard.guard";
import {StudentProfileGuard} from "./guards/student-profile.guard";
import {HomeComponent} from "./view/dash-board/home/home.component";
import {StudentComponent} from "./view/dash-board/student/student.component";
import {StaffComponent} from "./view/dash-board/staff/staff.component";
import {StaffRegistrationComponent} from "./view/dash-board/staff-registration/staff-registration.component";
import {BookComponent} from "./view/dash-board/book/book.component";
import {BookRegistrationComponent} from "./view/dash-board/book-registration/book-registration.component";
import {SettingComponent} from "./view/dash-board/setting/setting.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/main'
  },
  {
    component: MainMenuComponent,
    path: 'main',
    canActivate: [MainMenuGuard]
  },
  {
    component: SearchResultComponent,
    path: 'search-book'
  },
  {
    component: StudentProfileComponent,
    path: 'student-profile',
    canActivate: [StudentProfileGuard]
  },
  {
    component: DashBoardComponent,
    path: 'dash-board',
    canActivate: [DashboardGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: HomeComponent},
      {path: 'book', component: BookComponent},
      {path: 'student', component: StudentComponent},
      {path: 'staff', component: StaffComponent},
      {path: 'book-registration', component: BookRegistrationComponent},
      {path: 'student-registration', component: StudentRegistrationComponent},
      {path: 'staff-registration', component: StaffRegistrationComponent},
      {path: 'setting', component: SettingComponent},
      {path: '**', pathMatch:'full', redirectTo: 'home'},
    ]
  },
  {
    path: '**',
    redirectTo: '/main'
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRouterModule { }
