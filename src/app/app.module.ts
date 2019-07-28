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
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { AuthenticationLoginComponent } from './component/authentication/pages/login/login.component';
import { AuthenticationRegisterComponent } from './component/authentication/pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { SendAudioComponent } from './component/send-audio/send-audio.component';
import { DataRequestComponent } from './component/data-request/data-request.component';
import { FormlyEmailInput } from './component/shared/formly/email/email.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { LibraryComponent } from './component/library/pages/home/home.component';
import { AudioAnalysisComponent } from './component/audio-analysis/audio-analysis.component';
import { WebStatisticsComponent } from './component/web-statistics/web-statistics.component';
import { LayoutMenusService } from './services/layout-menus/layout-menus.service';

import { BawApiService } from './services/baw-api/baw-api.service';
import { aboutComponents } from './component/about/about.components';
import { profileComponents } from './component/profile/profile.components';
import { sharedComponents } from './component/shared/shared.components';
import { SecondaryMenuComponent } from './component/shared/secondary-menu/secondary-menu.component';
import { ActionMenuComponent } from './component/shared/action-menu/action-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    aboutComponents,
    AudioAnalysisComponent,
    DataRequestComponent,
    FormlyEmailInput,
    HomeComponent,
    LibraryComponent,
    ListenComponent,
    AuthenticationLoginComponent,
    profileComponents,
    ProjectsComponent,
    AuthenticationRegisterComponent,
    SendAudioComponent,
    sharedComponents,
    WebStatisticsComponent,
    SecondaryMenuComponent,
    ActionMenuComponent
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
