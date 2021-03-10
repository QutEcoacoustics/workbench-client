import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { LineTruncationLibModule } from "ngx-line-truncation";
import { CardImageComponent } from "./card-image/card-image.component";
import { CardComponent } from "./card/card.component";
import { CardsComponent } from "./cards.component";

/**
 * Cards Module
 */
@NgModule({
  declarations: [CardsComponent, CardComponent, CardImageComponent],
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    AuthenticatedImageModule,
    LineTruncationLibModule,
  ],
  exports: [CardsComponent],
})
export class CardsModule {}
