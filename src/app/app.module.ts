import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/shared/header/header.component';
import { FooterComponent } from './component/shared/footer/footer.component';
import { CardsComponent } from './component/shared/cards/cards.component';
import { CardComponent } from './component/shared/cards/card/card.component';
import { ProjectsHomeComponent } from './component/projects/pages/projects-home/projects-home.component';
import { CardImageComponent } from './component/shared/cards/card-image/card-image.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsHomeComponent,
    FooterComponent,
    CardsComponent,
    CardComponent,
    CardImageComponent
  ],
  imports: [NgbModule, BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
