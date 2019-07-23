import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { AnalysisSubmitComponent } from './component/analysis/pages/submit/submit.component';
import { AnalysisRequestComponent } from './component/analysis/pages/request/request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { AboutContactComponent } from './component/about/pages/contact/contact.component';
import { AboutReportComponent } from './component/about/pages/report/report.component';
import { AboutEthicsComponent } from './component/about/pages/ethics/ethics.component';
import { AboutCreditsComponent } from './component/about/pages/credits/credits.component';
import { AboutDisclaimersComponent } from './component/about/pages/disclaimers/disclaimers.component';
import { ProfileComponent } from './component/profile/pages/home/home.component';

import { settings, RouteSettings } from './settings/app-settings';

function readRoutes(path: string, routes: RouteSettings[]) {
  routes.map(route => {
    const newPath = path + '/' + route.path;

    if (route.routes) {
      readRoutes(newPath, route.routes);
    } else {
      console.debug('Path: ' + newPath);
      console.debug(route);
    }
  });
}

readRoutes(settings.path, settings.routes);

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
    path: 'about',
    children: [
      { path: 'contact', component: AboutContactComponent },
      { path: 'report', component: AboutReportComponent },
      { path: 'ethics', component: AboutEthicsComponent },
      { path: 'credits', component: AboutCreditsComponent },
      { path: 'disclaimers', component: AboutDisclaimersComponent }
    ]
  },
  {
    path: 'profile',
    children: [{ path: '', pathMatch: 'full', component: ProfileComponent }]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
