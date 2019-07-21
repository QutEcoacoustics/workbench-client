import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { AnalysisSubmitComponent } from './component/analysis/pages/submit/submit.component';
import { AnalysisRequestComponent } from './component/analysis/pages/request/request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { ContactComponent } from './component/contact/pages/home/home.component';
import { ContactReportComponent } from './component/contact/pages/report/report.component';
import { ContactEthicsComponent } from './component/contact/pages/ethics/ethics.component';
import { ContactCreditsComponent } from './component/contact/pages/credits/credits.component';
import { ContactDisclaimersComponent } from './component/contact/pages/disclaimers/disclaimers.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  {
    path: 'analysis',
    children: [
      { path: 'submit', component: AnalysisSubmitComponent },
      { path: 'request', component: AnalysisRequestComponent }
    ]
  },
  { path: 'listen', component: ListenComponent },
  {
    path: 'contact',
    children: [
      { path: '', pathMatch: 'full', component: ContactComponent },
      { path: 'report', component: ContactReportComponent },
      { path: 'ethics', component: ContactEthicsComponent },
      { path: 'credits', component: ContactCreditsComponent },
      { path: 'disclaimers', component: ContactDisclaimersComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
