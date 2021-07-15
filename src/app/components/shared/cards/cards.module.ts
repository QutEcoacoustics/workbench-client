import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { CardImageComponent } from "./card-image/card-image.component";
import { CardsComponent } from "./cards.component";

/**
 * Cards Module
 */
@NgModule({
  declarations: [CardsComponent, CardImageComponent],
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    AuthenticatedImageModule,
  ],
  exports: [CardsComponent],
})
export class CardsModule {}
