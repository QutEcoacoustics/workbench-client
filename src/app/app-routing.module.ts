import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { SendAudioComponent } from './component/send-audio/send-audio.component';
import { DataRequestComponent } from './component/data-request/data-request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { AboutContactComponent } from './component/about/pages/contact/contact.component';
import { AboutReportComponent } from './component/about/pages/report/report.component';
import { AboutEthicsComponent } from './component/about/pages/ethics/ethics.component';
import { AboutCreditsComponent } from './component/about/pages/credits/credits.component';
import { AboutDisclaimersComponent } from './component/about/pages/disclaimers/disclaimers.component';
import { ProfileComponent } from './component/profile/pages/home/home.component';
import { AudioAnalysisComponent } from './component/audio-analysis/audio-analysis.component';
import { WebStatisticsComponent } from './component/web-statistics/web-statistics.component';
import { LibraryComponent } from './component/library/pages/library/home.component';
import { ResearchAboutComponent } from './component/research/pages/about/about.component';
import { ResearchArticlesComponent } from './component/research/pages/articles/articles.component';
import { ResearchPeopleComponent } from './component/research/pages/people/people.component';
import { ResearchPublicationsComponent } from './component/research/pages/publications/publications.component';
import { ResearchResourcesComponent } from './component/research/pages/resources/resources.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'about',
    children: [
      { path: 'contact', component: AboutContactComponent },
      { path: 'credits', component: AboutCreditsComponent },
      { path: 'disclaimers', component: AboutDisclaimersComponent },
      { path: 'ethics', component: AboutEthicsComponent },
      { path: 'report', component: AboutReportComponent }
    ]
  },
  { path: 'audio_analysis', component: AudioAnalysisComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'listen', component: ListenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'data_request', component: DataRequestComponent },
  { path: 'statistics', component: WebStatisticsComponent },
  { path: 'send_audio', component: SendAudioComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'research',
    children: [
      { path: 'about', component: ResearchAboutComponent },
      { path: 'articles', component: ResearchArticlesComponent },
      { path: 'people', component: ResearchPeopleComponent },
      { path: 'publications', component: ResearchPublicationsComponent },
      { path: 'resources', component: ResearchResourcesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
