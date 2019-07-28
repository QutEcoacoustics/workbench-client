import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { AuthenticationLoginComponent } from './component/authentication/pages/login/login.component';
import { AuthenticationRegisterComponent } from './component/authentication/pages/register/register.component';
import { SendAudioComponent } from './component/send-audio/send-audio.component';
import { DataRequestComponent } from './component/data-request/data-request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { ProfileComponent } from './component/profile/pages/home/home.component';
import { AudioAnalysisComponent } from './component/audio-analysis/audio-analysis.component';
import { WebStatisticsComponent } from './component/web-statistics/web-statistics.component';
import { LibraryComponent } from './component/library/pages/home/home.component';
import { aboutRoutes } from './component/about/about.routes';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  aboutRoutes,
  { path: 'audio_analysis', component: AudioAnalysisComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'listen', component: ListenComponent },
  { path: 'login', component: AuthenticationLoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'data_request', component: DataRequestComponent },
  { path: 'statistics', component: WebStatisticsComponent },
  { path: 'send_audio', component: SendAudioComponent },
  { path: 'register', component: AuthenticationRegisterComponent },
  {
    path: 'research',
    children: [
      { path: 'about', redirectTo: 'https://research.ecosounds.org/' },
      {
        path: 'articles',
        redirectTo: 'https://research.ecosounds.org/articles.html'
      },
      {
        path: 'resources',
        redirectTo: 'https://research.ecosounds.org/resources.html'
      },
      {
        path: 'people',
        redirectTo: 'https://research.ecosounds.org/people/people.html'
      },
      {
        path: 'publications',
        redirectTo:
          'https://research.ecosounds.org/publications/publications.html'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
