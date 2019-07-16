import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormioModule, FormioAppConfig } from 'angular-formio';

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
import { ProjectsHomeComponent } from './component/projects/pages/projects-home/projects-home.component';
import { LoginComponent } from './component/authentication/pages/login/login.component';
import { LogoutComponent } from './component/authentication/pages/logout/logout.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormGenerationComponent } from './component/shared/form-generation/form-generation.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CardImageComponent,
    CardsComponent,
    ProjectsHomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    FormGenerationComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
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
