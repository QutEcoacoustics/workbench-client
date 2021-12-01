import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { IconsModule } from "@shared/icons/icons.module";
import { ModelLinkComponent } from "./model-link.component";

@NgModule({
  declarations: [ModelLinkComponent],
  imports: [
    CommonModule,
    IconsModule,
    NgbTooltipModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [ModelLinkComponent],
})
export class ModelLinkModule {}
