import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { IconsModule } from "@shared/icons/icons.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { GhostUserHintComponent } from "./ghost-user-hint/ghost-user-hint.component";
import { ModelLinkComponent } from "./model-link/model-link.component";
import { UserLinkComponent } from "./user-link/user-link.component";

const components = [
  ModelLinkComponent,
  UserLinkComponent,
  GhostUserHintComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    IconsModule,
    NgbTooltipModule,
    PipesModule,
    DirectivesModule,
    LoadingModule,
  ],
  exports: components,
})
export class ModelLinkModule {}
