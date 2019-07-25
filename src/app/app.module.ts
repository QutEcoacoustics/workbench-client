import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/shared/header/header.component';
import { FooterComponent } from './component/shared/footer/footer.component';
import { CardComponent } from './component/shared/cards/card/card.component';
import { CardImageComponent } from './component/shared/cards/card-image/card-image.component';
import { CardsComponent } from './component/shared/cards/cards.component';
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { SendAudioComponent } from './component/send-audio/send-audio.component';
import { DataRequestComponent } from './component/data-request/data-request.component';
import { FormlyEmailInput } from './component/shared/formly/email/email.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { AboutContactComponent } from './component/about/pages/contact/contact.component';
import { AboutReportComponent } from './component/about/pages/report/report.component';
import { AboutEthicsComponent } from './component/about/pages/ethics/ethics.component';
import { AboutCreditsComponent } from './component/about/pages/credits/credits.component';
import { AboutDisclaimersComponent } from './component/about/pages/disclaimers/disclaimers.component';
import { ProfileComponent } from './component/profile/pages/home/home.component';
import { ProfileIconComponent } from './component/profile/icon/icon.component';
import { ProfileStatisticsComponent } from './component/profile/statistics/statistics.component';
import { ProfileTagsComponent } from './component/profile/tags/tags.component';
import { LibraryComponent } from './component/library/pages/library/home.component';
import { ResearchAboutComponent } from './component/research/pages/about/about.component';
import { ResearchArticlesComponent } from './component/research/pages/articles/articles.component';
import { ResearchResourcesComponent } from './component/research/pages/resources/resources.component';
import { ResearchPeopleComponent } from './component/research/pages/people/people.component';
import { ResearchPublicationsComponent } from './component/research/pages/publications/publications.component';
import { AudioAnalysisComponent } from './component/audio-analysis/audio-analysis.component';
import { WebStatisticsComponent } from './component/web-statistics/web-statistics.component';
import { LayoutComponent } from './component/shared/layout/layout.component';
import { LayoutMenusService } from './services/layout-menus/layout-menus.service';

import { BawApiService } from './services/baw-api/baw-api.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutContactComponent,
    AboutCreditsComponent,
    AboutDisclaimersComponent,
    AboutEthicsComponent,
    AboutReportComponent,
    AudioAnalysisComponent,
    CardComponent,
    CardImageComponent,
    CardsComponent,
    DataRequestComponent,
    FooterComponent,
    FormlyEmailInput,
    HeaderComponent,
    HomeComponent,
    LayoutComponent,
    LibraryComponent,
    ListenComponent,
    LoginComponent,
    ProfileComponent,
    ProfileIconComponent,
    ProfileStatisticsComponent,
    ProfileTagsComponent,
    ProjectsComponent,
    RegisterComponent,
    ResearchAboutComponent,
    ResearchArticlesComponent,
    ResearchPeopleComponent,
    ResearchPublicationsComponent,
    ResearchResourcesComponent,
    SendAudioComponent,
    WebStatisticsComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      types: [{ name: 'email', component: FormlyEmailInput }]
    }),
    FormlyBootstrapModule
  ],
  providers: [BawApiService, LayoutMenusService],
  bootstrap: [AppComponent],
  exports: [HomeComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
