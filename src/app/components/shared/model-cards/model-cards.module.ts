import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { IconsModule } from "@shared/icons/icons.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { CardComponent } from "./card/card.component";
import { CardsComponent } from "./cards/cards.component";

/**
 * Cards Module
 */
@NgModule({
  declarations: [CardsComponent, CardComponent],
  imports: [CommonModule, RouterModule, DirectivesModule, IconsModule, NgbTooltipModule, PipesModule, LoadingModule],
  exports: [CardsComponent],
})
export class ModelCardsModule {}
