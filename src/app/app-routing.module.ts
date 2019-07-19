import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { LogoutComponent } from './component/authentication/pages/logout/logout.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { AnalysisSubmitComponent } from './component/analysis/pages/submit/submit.component';
import { AnalysisRequestComponent } from './component/analysis/pages/request/request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  {
    path: 'analysis',
    children: [
      { path: 'submit', component: AnalysisSubmitComponent },
      { path: 'request', component: AnalysisRequestComponent }
    ]
  },
  { path: 'listen', component: ListenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
