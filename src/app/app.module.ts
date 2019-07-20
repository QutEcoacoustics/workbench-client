import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUsers,
  faNewspaper,
  faBriefcase,
  faUserCircle,
  faGlobeAsia,
  faEnvelope,
  faTable,
  faFileAudio,
  faChartArea
} from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/shared/header/header.component';
import { FooterComponent } from './component/shared/footer/footer.component';
import { CardComponent } from './component/shared/cards/card/card.component';
import { CardImageComponent } from './component/shared/cards/card-image/card-image.component';
import { CardsComponent } from './component/shared/cards/cards.component';
import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { LogoutComponent } from './component/authentication/pages/logout/logout.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsSiteComponent } from './component/projects/pages/site/site.component';
import { AnalysisSubmitComponent } from './component/analysis/pages/submit/submit.component';
import { AnalysisRequestComponent } from './component/analysis/pages/request/request.component';
import { FormlyEmailInput } from './component/shared/formly/email/email.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { ScriptComponent } from './component/shared/script/script.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CardImageComponent,
    CardsComponent,
    HomeComponent,
    ProjectsComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ProjectsSiteComponent,
    AnalysisSubmitComponent,
    AnalysisRequestComponent,
    FormlyEmailInput,
    ListenComponent,
    ScriptComponent
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
  providers: [],
  bootstrap: [AppComponent],
  exports: [HomeComponent]
})
export class AppModule {
  constructor() {
    library.add(
      faUsers,
      faNewspaper,
      faBriefcase,
      faUserCircle,
      faGlobeAsia,
      faEnvelope,
      faTable,
      faFileAudio,
      faChartArea
    );
  }
}
